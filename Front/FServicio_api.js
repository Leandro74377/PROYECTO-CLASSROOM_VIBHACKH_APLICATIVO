const API_BASE = 'http://localhost:4000/api';

export async function getCourses() {
	const res = await fetch(`${API_BASE}/courses`);
	if (!res.ok) throw new Error('API error');
	return res.json();
}
