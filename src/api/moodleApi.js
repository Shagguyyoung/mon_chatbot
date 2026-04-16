const TOKEN = import.meta.env.VITE_MOODLE_TOKEN

async function callMoodle(wsfunction, params = {}) {
  const url = new URL(`http://localhost:5173/moodle/webservice/rest/server.php`)
  url.searchParams.set("wstoken", TOKEN)
  url.searchParams.set("wsfunction", wsfunction)
  url.searchParams.set("moodlewsrestformat", "json")
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url)
  return res.json()
}

export async function getCourses(userId) {
  return callMoodle("core_enrol_get_users_courses", { userid: userId })
}

export async function getAssignments(courseId) {
  return callMoodle("mod_assign_get_assignments", { "courseids[0]": courseId })
}

export async function getGrades(courseId, userId) {
  return callMoodle("gradereport_user_get_grade_items", {
    courseid: courseId,
    userid: userId
  })
}