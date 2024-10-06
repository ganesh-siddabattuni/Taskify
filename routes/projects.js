const express = require('express');
const router = express.Router();
const opDB = require('../db/OpTaskDB');

// Get all of the user's projects
router.get("/:id", async (req, res) => {
  try {
    const projectArray = await opDB.getUserProjects(req.params.id);
    res.send(projectArray);
  } catch (err) {
    console.error("Error fetching user projects:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get the count of projects for a specific user
router.get('/:userId/count', async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await opDB.getProjectCount(userId);
    res.json(result);
  } catch (error) {
    console.error("Error fetching profile project count:", error);
    res.status(500).send("Error fetching profile project count");
  }
});

// Get most recent projects for profile page
router.get("/:id/profile", async (req, res) => {
  try {
    const projectArray = await opDB.getProfileProjects(req.params.id);
    res.send(projectArray);
  } catch (err) {
    console.error("Error fetching profile projects:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get a paginated amount of projects to return to the dashboard
router.get("/:id/page/:pagenumber", async (req, res) => {
  try {
    const projectArray = await opDB.getPageProjects(req.params.id, req.params.pagenumber);
    res.send(projectArray);
  } catch (err) {
    console.error("Error fetching paginated projects:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get the count of user's projects
router.get("/:id/count", async (req, res) => {
  try {
    const projectsCount = await opDB.getUserProjectCount(req.params.id);
    res.send({ count: projectsCount });
  } catch (err) {
    console.error("Error fetching project count:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get project data
router.get("/projectData/:id", async (req, res) => {
  try {
    const projectData = await opDB.getProject(req.params.id);
    res.send(projectData);
  } catch (err) {
    console.error("Error fetching project data:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Create a new project
router.post("/", async (req, res) => {
  try {
    const postResult = await opDB.createProject(req.body);
    res.send(postResult);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Create a new task
router.post("/newtask", async (req, res) => {
  try {
    const newTaskResult = await opDB.createTask(req.body);
    res.send(newTaskResult);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get tasks for a project
router.get("/:id/tasks", async (req, res) => {
  try {
    const projectTasks = await opDB.getTasks(req.params.id);
    res.send(projectTasks);
  } catch (err) {
    console.error("Error fetching project tasks:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Update task timeline state
router.post("/updatetask", async (req, res) => {
  try {
    const newTaskTimelineObject = req.body;
    const result = await opDB.updateTaskTimelineState(newTaskTimelineObject);
    res.send({ done: true });
  } catch (err) {
    console.error("Error updating task timeline:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Update task text
router.post("/updatetasktext", async (req, res) => {
  try {
    const result = await opDB.updateTaskText(req.body);
    res.send({ done: true });
  } catch (err) {
    console.error("Error updating task text:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a task
router.post("/deletetask", async (req, res) => {
  try {
    const taskId = req.body.taskId;
    const result = await opDB.deleteTask(taskId);
    res.send(result);
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Update project
router.post("/updateProject/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const newName = req.body.newName;
    const newDescription = req.body.newDescription;
    const result = await opDB.updateProject(projectId, newName, newDescription);
    res.send({ updated: true });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a project
router.post("/deleteProject/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const result = await opDB.deleteProject(projectId);
    res.send({ deleted: true });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
