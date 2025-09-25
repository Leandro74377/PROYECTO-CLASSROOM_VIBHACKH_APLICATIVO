import React, { useEffect, useState } from 'react'
import Courses from './components/Courses'


export default function App() {
const [me, setMe] = useState(null)


useEffect(() => {
fetch('/api/me')
.then(r => r.json())
.then(setMe)
.catch(() => setMe(null))
}, [])


return (
<div style={{ padding: 20 }}>
<h1>Classroom Helper</h1>
{!me ? (
<div>
<p>No estás logueado.</p>
<a href="/auth/google">
	<img src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png" alt="Iniciar sesión con Google" style={{height:40}} />
</a>
</div>
) : (
<div>
<p>Hola, {me.name} ({me.email})</p>
<Courses />
</div>
)}
</div>
)
}
