import { Ollama } from 'ollama'

export const ollama = new Ollama({
  host: 'http://192.168.0.104:11434',
})

export enum ERole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

export class SystemPrompt {
  private readonly baseInstruction: string
  private readonly language: string

  constructor(baseInstruction: string, language: string) {
    this.baseInstruction = baseInstruction
    this.language = language
  }

  getContent(): string {
    return [
      this.baseInstruction.trim(),
      '',
      '---',
      `Активный язык ответа (код ISO 639-1): ${this.language}. Все текстовые значения в полях JSON-ответа (description, marketOverview и т.д.) пиши строго на этом языке.`,
    ].join('\n')
  }
}

export class UserJsonPrompt {
  constructor(private readonly params: Record<string, unknown>) {}

  getContent(): string {
    return JSON.stringify({ params: this.params }, null, 2)
  }
}

class Chat {
  readonly id: string
  private readonly name: string
  private readonly model: string
  private readonly think: boolean
  private readonly messages: Array<{
    role: ERole
    content: string
  }>

  constructor(
    name: string,
    model: string,
    systemPrompt: SystemPrompt,
    think: boolean = false,
  ) {
    this.id = crypto.randomUUID()
    this.name = name
    this.model = model
    this.think = think
    this.messages = [
      {
        role: ERole.SYSTEM,
        content: systemPrompt.getContent(),
      },
    ]
  }

  async chat(userPayload: UserJsonPrompt) {
    this.messages.push({
      role: ERole.USER,
      content: userPayload.getContent(),
    })

    const response = await ollama.chat({
      model: this.model,
      messages: this.messages,
      think: this.think,
    })

    this.messages.push({
      role: ERole.ASSISTANT,
      content: response.message.content,
    })

    return this.messages[this.messages.length - 1].content
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

  static createChat(name: string, systemPrompt: SystemPrompt) {
    const chat = new Chat(name, OllamaController.model, systemPrompt)
    OllamaController.chats.set(chat.getId(), chat)
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
  }

  static clearChats() {
    OllamaController.chats.clear()
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
