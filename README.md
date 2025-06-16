# 🌐 ohttp

> Uma biblioteca de requisições HTTP orientada a objetos para TypeScript.  
> Flexível, extensível e com suporte a interceptação, autenticação, monitoramento de download e muito mais.

---

## 📦 Instalação

```bash
npm install ohttp
# ou
yarn add ohttp
```

---

## 🔧 Importação

```ts
import { BaseApi, Methods, Abstracts, Contracts } from 'ohttp'
```

---

## 🧱 Estrutura do Projeto

```
src/
├── abstracts/           # Classes abstratas reutilizáveis
├── api/                 # Core da biblioteca (BaseApi)
├── contracts/           # Interfaces (tipagens e contratos)
├── examples/            # Exemplos de uso
├── methods/             # Métodos HTTP (Get, Post, etc)
├── package.json
├── tsconfig.json
├── README.md
```

---

## 🚀 Uso Básico

Crie uma classe para cada requisição estendendo `BaseApi` e passando o método HTTP desejado:

```ts
import { BaseApi, Methods } from 'ohttp'

class GetUserApi extends BaseApi {
  constructor(userId: string) {
    super()

    this.setMethod(new Methods.Get(`https://api.example.com/users/${userId}`))
  }

  async run() {
    return await this.execute()
  }
}
```

### 🧪 Exemplo de uso

```ts
const user = await new GetUserApi('123').run()
console.log(user.name)
```

---

## 📡 Métodos HTTP Suportados

Disponíveis no namespace `Methods`:

```ts
new Methods.Get(uri)
new Methods.Post(uri, data)
new Methods.Put(uri, data)
new Methods.Delete(uri)
new Methods.Patch(uri, data)
new Methods.Options(uri)
new Methods.Head(uri)
new Methods.Connect(uri)
new Methods.Trace(uri)
```

---

## 🧠 Uso Avançado

Você pode estender `BaseApi` e customizar:

- Headers personalizados
- Hooks antes e depois da requisição
- Monitoramento de download
- Tratamento de erros com classes reutilizáveis

```ts
import { BaseApi, Methods, Abstracts } from 'ohttp'

class DownloadFileApi extends BaseApi {
  constructor(fileId: string, token: string) {
    super()

    this.setMethod(new Methods.Get(`https://api.example.com/files/${fileId}`))
      .setHeaders({
        Authorization: `Bearer ${token}`,
        Accept: 'application/octet-stream',
      })
      .setMonitor({
        onDownloadProgress: (received, total) => {
          console.log(`Download: ${received} / ${total}`)
        },
      })
      .setHooks({
        beforeRequest: () => console.log('Iniciando...'),
        afterRequest: (res) => console.log('Finalizado', res.status),
      })
      .setErrorHandler(new Abstracts.BaseErrorHandler())
  }

  async run(): Promise<Blob> {
    return await this.execute()
  }
}
```

---

## ✅ Funcionalidades

| Recurso                       | Suporte |
|------------------------------|---------|
| `fetch` nativo               | ✅       |
| Padrão orientado a objetos   | ✅       |
| Requisições genéricas        | ✅       |
| Monitoramento de download    | ✅       |
| Interceptadores de execução  | ✅       |
| Headers personalizados       | ✅       |
| Tratamento de erro customizável | ✅    |
| Token JWT ou outro tipo de auth | ✅    |

---

## 📐 Contratos (Interfaces)

Disponíveis via `Contracts`.

### `IFetchMethod`

```ts
interface IFetchMethod {
  getMethod(): string
  getUri(): string
  getData(): any
}
```

---

### `IRequestHook`

```ts
interface IRequestHook {
  beforeRequest?: () => void | Promise<void>
  afterRequest?: (response: Response) => void | Promise<void>
}
```

---

### `IDownloadMonitor`

```ts
interface IDownloadMonitor {
  onDownloadProgress?: (loaded: number, total?: number) => void
}
```

---

### `IErrorHandler`

```ts
interface IErrorHandler {
  handleError(error: unknown): void
}
```

---

## 🧱 Classes Abstratas

### `BaseErrorHandler`

```ts
abstract class BaseErrorHandler implements IErrorHandler {
  abstract handleError(error: unknown): void
}
```

#### Exemplo:

```ts
class MyHandler extends Abstracts.BaseErrorHandler {
  handleError(error: unknown): void {
    console.error('Erro capturado:', error)
  }
}
```

---

## 🧪 Exemplo Completo

```ts
import { BaseApi, Methods, Contracts, Abstracts } from 'ohttp'

class GetUserData extends BaseApi {
  constructor(token: string) {
    super()

    this.setMethod(new Methods.Get('https://api.example.com/user/data'))
      .setHeaders({ Authorization: `Bearer ${token}` })
      .setHooks({
        beforeRequest: () => console.log('Preparando...'),
        afterRequest: () => console.log('Finalizado'),
      })
      .setErrorHandler(new class extends Abstracts.BaseErrorHandler {
        handleError(err: unknown): void {
          console.warn('Erro:', err)
        }
      })
  }

  async run() {
    return await this.execute()
  }
}

const data = await new GetUserData('your_token').run()
console.log(data)
```
---

## 🛠 Contribuindo

1. Faça um fork
2. Crie uma branch (`feat/minha-funcionalidade`)
3. Faça commit das alterações
4. Envie um PR

---

## 📄 Licença

MIT License © 2025
