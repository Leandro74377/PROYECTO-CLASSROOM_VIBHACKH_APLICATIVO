export async function getCourses() {
const res = await fetch('/api/classroom/courses');
if (!res.ok) throw new Error('API error');
return res.json();
}
