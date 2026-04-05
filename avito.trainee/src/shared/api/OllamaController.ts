import { Ollama } from 'ollama'

const ollamaHost =
  import.meta.env.VITE_OLLAMA_HOST ?? 'http://192.168.0.100:11434'

export const ollama = new Ollama({
  host: ollamaHost,
})

export enum ERole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

type ChatMessage = {
  role: ERole
  content: string
}

type SerializedChat = {
  id: string
  name: string
  model: string
  think: boolean
  messages: ChatMessage[]
}

export class SystemPrompt {
  private readonly baseInstruction: string
  private readonly language: string | undefined

  constructor(baseInstruction: string, language?: string) {
    this.baseInstruction = baseInstruction
    this.language = language
  }

  getContent(): string {
    if (this.language) {
      return [
        this.baseInstruction.trim(),
        '',
        '---',
        `Активный язык ответа (код ISO 639-1): ${this.language}. Все текстовые значения в полях JSON-ответа (description, marketOverview и т.д.) пиши строго на этом языке.`,
      ].join('\n')
    }

    return this.baseInstruction.trim()
  }
}

export class UserJsonPrompt {
  constructor(private readonly params: Record<string, unknown>) {}

  getContent(): string {
    return JSON.stringify({ params: this.params }, null, 2)
  }
}

let persistOllamaChats: () => void = () => {}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false
  const m = value as Record<string, unknown>
  return (
    typeof m.content === 'string' &&
    (m.role === ERole.SYSTEM ||
      m.role === ERole.USER ||
      m.role === ERole.ASSISTANT)
  )
}

class Chat {
  readonly id: string
  private readonly name: string
  private readonly model: string
  private readonly think: boolean
  private readonly messages: ChatMessage[]

  private constructor(
    id: string,
    name: string,
    model: string,
    think: boolean,
    messages: ChatMessage[],
  ) {
    this.id = id
    this.name = name
    this.model = model
    this.think = think
    this.messages = messages
  }

  static create(
    name: string,
    model: string,
    systemPrompt: SystemPrompt,
    think: boolean = false,
  ): Chat {
    return new Chat(crypto.randomUUID(), name, model, think, [
      { role: ERole.SYSTEM, content: systemPrompt.getContent() },
    ])
  }

  static fromSerialized(raw: unknown): Chat | null {
    if (!raw || typeof raw !== 'object') return null
    const data = raw as Record<string, unknown>
    if (typeof data.id !== 'string' || typeof data.name !== 'string') {
      return null
    }
    if (typeof data.model !== 'string') return null
    if (!Array.isArray(data.messages)) return null

    const messages = data.messages.filter(isChatMessage)
    if (messages.length === 0) return null

    return new Chat(
      data.id,
      data.name,
      data.model,
      Boolean(data.think),
      messages.map((m) => ({ role: m.role, content: m.content })),
    )
  }

  toSerialized(): SerializedChat {
    return {
      id: this.id,
      name: this.name,
      model: this.model,
      think: this.think,
      messages: this.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }
  }

  pushUserMessage(text: string): void {
    const trimmed = text.trim()
    if (!trimmed) {
      throw new Error('Сообщение не может быть пустым')
    }
    this.messages.push({
      role: ERole.USER,
      content: trimmed,
    })
    persistOllamaChats()
  }

  async completeAssistantReply(): Promise<string> {
    const response = await ollama.chat({
      model: this.model,
      messages: this.messages,
      think: this.think,
    })

    this.messages.push({
      role: ERole.ASSISTANT,
      content: response.message.content,
    })
    persistOllamaChats()

    return response.message.content
  }

  rollbackToMessageCount(count: number): void {
    if (count < 0) return
    if (count >= this.messages.length) return
    this.messages.length = count
    persistOllamaChats()
  }

  private async exchangeUserContent(content: string): Promise<string> {
    this.pushUserMessage(content)
    return this.completeAssistantReply()
  }

  async chat(userPayload: UserJsonPrompt) {
    return this.exchangeUserContent(userPayload.getContent())
  }

  async sendTextMessage(text: string): Promise<string> {
    return this.exchangeUserContent(text)
  }

  addSystemPrompt(systemPrompt: SystemPrompt) {
    this.messages.push({
      role: ERole.SYSTEM,
      content: systemPrompt.getContent(),
    })
    persistOllamaChats()
  }

  getName() {
    return this.name
  }

  getMessages() {
    return this.messages
  }

  getModel() {
    return this.model
  }

  getId() {
    return this.id
  }
}

export class OllamaController {
  private static readonly chats = new Map<string, Chat>()
  private static readonly model = 'deepseek-r1:8b'
  private static readonly STORAGE_KEY = 'avito.ollama.chats'

  static {
    persistOllamaChats = () => {
      OllamaController.persistChats()
    }
    OllamaController.hydrateFromStorage()
  }

  private static persistChats() {
    if (typeof localStorage === 'undefined') return
    try {
      const payload: SerializedChat[] = Array.from(
        OllamaController.chats.values(),
      ).map((c) => c.toSerialized())
      localStorage.setItem(
        OllamaController.STORAGE_KEY,
        JSON.stringify(payload),
      )
    } catch {
      // quota / private mode
    }
  }

  private static hydrateFromStorage() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(OllamaController.STORAGE_KEY)
      if (!raw) return
      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) return
      for (const item of parsed) {
        const chat = Chat.fromSerialized(item)
        if (chat) {
          OllamaController.chats.set(chat.getId(), chat)
        }
      }
    } catch {
      // corrupt or invalid JSON
    }
  }

  static createChat(name: string, systemPrompt: SystemPrompt) {
    const chat = Chat.create(name, OllamaController.model, systemPrompt)
    OllamaController.chats.set(chat.getId(), chat)
    OllamaController.persistChats()
    return chat
  }

  static getChat(id: string) {
    return OllamaController.chats.get(id)
  }

  static getChats() {
    return Array.from(OllamaController.chats.values())
  }

  static deleteChat(id: string) {
    OllamaController.chats.delete(id)
    OllamaController.persistChats()
  }

  static clearChats() {
    OllamaController.chats.clear()
    OllamaController.persistChats()
  }

  static async chat(message: string) {
    const response = await ollama.chat({
      model: this.model,
      messages: [
        {
          role: ERole.USER,
          content: message,
        },
      ],
    })

    return response.message.content
  }
}
