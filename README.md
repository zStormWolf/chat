# 💬 Chat App en Tiempo Real

Una aplicación de chat en tiempo real construida con React, Node.js, Express y Socket.IO.

## 🚀 Características

- ✅ Chat en tiempo real
- ✅ Historial de mensajes persistente
- ✅ Interfaz moderna con Chakra UI
- ✅ Autenticación con clave secreta
- ✅ Responsive design

## 🛠️ Tecnologías

### Frontend
- React 18
- Chakra UI
- Socket.IO Client
- React Icons

### Backend
- Node.js
- Express
- Socket.IO
- CORS

## 📦 Instalación Local

### Prerrequisitos
- Node.js (v14 o superior)
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd chat
```

2. **Instalar dependencias del servidor**
```bash
cd server
npm install
```

3. **Instalar dependencias del cliente**
```bash
cd ../client
npm install
```

4. **Configurar variables de entorno**
```bash
# En client/.env
REACT_APP_SERVER_URL=http://localhost:3001

# En server/.env (opcional)
PORT=3001
```

5. **Ejecutar la aplicación**

Terminal 1 (Servidor):
```bash
cd server
npm start
```

Terminal 2 (Cliente):
```bash
cd client
npm start
```

## 🌐 Deployment en Vercel

### Configuración Automática

1. **Conectar con GitHub**
   - Sube tu código a GitHub
   - Conecta tu repositorio con Vercel

2. **Variables de Entorno en Vercel**
   ```
   REACT_APP_SERVER_URL=https://tu-app.vercel.app/api
   ```

3. **Deploy**
   - Vercel detectará automáticamente la configuración
   - El frontend se desplegará como sitio estático
   - El backend se desplegará como funciones serverless

### Configuración Manual

Si prefieres configurar manualmente:

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

## 📱 Uso desde Dispositivos Móviles

Para acceder desde tu celular en la red local:

1. Encuentra la IP de tu computadora:
```bash
ipconfig  # Windows
ifconfig  # Mac/Linux
```

2. Accede desde tu celular:
```
http://TU_IP:3000
```

## 🔧 Configuración

### Cambiar la Clave Secreta

Edita la constante `SECRET_KEY` en:
- `server/index.js`
- `client/src/App.js`

### Personalizar Puerto

Cambia la variable `PORT` en `server/index.js` o usa variables de entorno.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas, abre un issue en GitHub.

---

Hecho con ❤️ por [Tu Nombre]
