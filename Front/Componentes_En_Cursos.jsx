import React, { useEffect, useState } from 'react'


export default function Courses() {
const [courses, setCourses] = useState([])
const [error, setError] = useState(null)


useEffect(() => {
fetch('/api/classroom/courses')
.then(res => {
if (!res.ok) throw new Error('error fetching');
return res.json();
})
.then(setCourses)
.catch(err => setError(err.message))
}, [])


if (error) return <div>Error: {error}</div>
if (!courses.length) return <div>No hay cursos visibles (o la app no tiene refresh_token guardado).</div>


return (
<div>
<h2>Mis cursos</h2>
<ul>
{courses.map(c => (
<li key={c.id}>{c.name} — {c.section || 'sin sección'}</li>
))}
</ul>
</div>
)
}
