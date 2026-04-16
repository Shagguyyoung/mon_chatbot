const MOODLE_URL = import.meta.env.VITE_MOODLE_URL
const TOKEN = import.meta.env.VITE_MOODLE_TOKEN

async function callMoodle(wsfunction, params = {}) {
  const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`)
  url.searchParams.set("wstoken", TOKEN)
  url.searchParams.set("wsfunction", wsfunction)
  url.searchParams.set("moodlewsrestformat", "json")
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url)
  return res.json()
}

// Récupérer les cours de l'étudiant
export async function getCourses(userId) {
  return callMoodle("core_enrol_get_users_courses", { userid: userId })
}

// Récupérer les devoirs d'un cours
export async function getAssignments(courseId) {
  return callMoodle("mod_assign_get_assignments", { "courseids[0]": courseId })
}

// Récupérer les annonces/forums
export async function getForumDiscussions(forumId) {
  return callMoodle("mod_forum_get_forum_discussions", { forumid: forumId })
}

// Récupérer les notes de l'étudiant
export async function getGrades(courseId, userId) {
  return callMoodle("gradereport_user_get_grade_items", {
    courseid: courseId,
    userid: userId
  })
}