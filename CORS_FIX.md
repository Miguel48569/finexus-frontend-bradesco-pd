# 🔧 Como Resolver o Erro de CORS

## ❌ Problema Atual

O backend está bloqueando requisições do frontend com erro:

```
Access to XMLHttpRequest at 'https://finexus-backend.onrender.com/usuarios/cadastro'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

## ✅ Solução no Backend

### **Para Spring Boot (Java):**

1. Adicione a dependência no `pom.xml` (se ainda não tiver):

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

2. Crie uma classe de configuração CORS:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:3000",           // Frontend local
                    "http://localhost:3001",           // Porta alternativa
                    "https://seu-dominio.vercel.app"   // Frontend em produção
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### **OU use anotação @CrossOrigin nos Controllers:**

```java
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = {"http://localhost:3000", "https://seu-dominio.vercel.app"})
public class UsuarioController {

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody UsuarioDTO usuario) {
        // seu código aqui
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login) {
        // seu código aqui
    }
}
```

---

### **Para Node.js/Express:**

1. Instale o pacote CORS:

```bash
npm install cors
```

2. Configure no servidor:

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

// Configuração CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://seu-dominio.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Suas rotas aqui...
```

---

## 🧪 Como Testar

Depois de configurar o CORS no backend:

1. Reinicie o servidor backend
2. Limpe o cache do navegador (Ctrl + Shift + Delete)
3. Tente cadastrar novamente no frontend
4. Verifique o console - não deve mais ter erro de CORS

---

## 📋 Checklist

- [ ] Configuração CORS adicionada no backend
- [ ] Origins permitidas incluem `http://localhost:3000`
- [ ] Métodos permitidos incluem POST, GET, PUT, DELETE
- [ ] Headers permitidos incluem `Authorization` e `Content-Type`
- [ ] `allowCredentials: true` configurado (para cookies/tokens)
- [ ] Backend reiniciado
- [ ] Frontend testado novamente

---

## 🔍 Verificação Adicional

Se ainda não funcionar, verifique também:

1. **Firewall/Antivírus** - pode estar bloqueando
2. **URL do backend** - confirme que está correta em `src/lib/api.ts`
3. **Backend está rodando** - acesse https://finexus-backend.onrender.com no navegador
4. **Formato dos dados** - veja no console o que está sendo enviado vs o que o backend espera

---

## 📞 Estrutura de Dados Esperada

O frontend está enviando para `/usuarios/cadastro`:

```json
{
  "nome": "string",
  "email": "string",
  "cpf": "string",
  "telefone": "string",
  "senha": "string",
  "tipoUsuario": "MEI" | "INVESTIDOR"
}
```

Certifique-se de que o backend aceita exatamente esses campos!
