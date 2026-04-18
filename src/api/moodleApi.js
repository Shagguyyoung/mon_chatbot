const TOKEN = import.meta.env.VITE_MOODLE_TOKEN
const MOODLE_URL = import.meta.env.VITE_MOODLE_URL

export function isMoodleAvailable() {
  return !!(TOKEN && MOODLE_URL)
}

async function callMoodle(wsfunction, params = {}) {
  const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`)
  url.searchParams.set("wstoken", TOKEN)
  url.searchParams.set("wsfunction", wsfunction)
  url.searchParams.set("moodlewsrestformat", "json")
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url)
  return res.json()
}

export async function getMoodleContext(userId, courseId) {
  try {
    const [courses, assignments, grades] = await Promise.all([
      callMoodle("core_enrol_get_users_courses", { userid: userId }),
      callMoodle("mod_assign_get_assignments", { "courseids[0]": courseId }),
      callMoodle("gradereport_user_get_grade_items", { courseid: courseId, userid: userId })
    ])
    return { courses, assignments, grades }
  } catch (e) {
    return null
  }
}