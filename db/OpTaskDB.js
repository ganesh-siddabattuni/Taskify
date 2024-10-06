require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

function OpTaskDB() {
  const opDB = {};
  const url = process.env.MONGO_URL; // Make sure this is set in your .env file
  const DB_NAME = "OpTask";

  // Save a new user to the DB
  opDB.saveNewUser = async function (newUser) {
    let client;
    try {
      console.log("Saving user....");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");
      const result = await usersCollection.insertOne(newUser);
      return result.insertedCount;
    } finally {
      client.close();
    }
  };

  // Find a user given a username
  opDB.getUserByEmail = async function (query) {
    let client;
    try {
      console.log("Finding user...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const usersCollections = db.collection("users");
      const results = await usersCollections.findOne({ username: query });
      console.log("Got user");
      return results;
    } finally {
      client.close();
    }
  };

  // Get a user object by Id
  opDB.getUserById = async function (query) {
    let client;
    try {
      console.log("Finding user...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");
      const results = await usersCollection.findOne({ _id: new ObjectId(query) });
      console.log("got user by id");
      return results;
    } finally {
      client.close();
    }
  };

  // Get paginated projects
  opDB.getPageProjects = async function(userId, pageNumber) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");

      const pageSize = 10; // Adjust page size as needed
      const skip = (parseInt(pageNumber) - 1) * pageSize;

      const projects = await projectsCollection.find({ ownerId: new ObjectId(userId) })
        .skip(skip)
        .limit(pageSize)
        .toArray();

      return projects;
    } finally {
      client.close();
    }
  };

  // Get profile projects (most recent 5)
  opDB.getProfileProjects = async function(userId) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");

      const projects = await projectsCollection.find({ ownerId: new ObjectId(userId) })
        .sort({ createdAt: -1 }) // Assuming you have a createdAt field
        .limit(5)
        .toArray();

      return projects;
    } finally {
      client.close();
    }
  };

  // Get project count for a user
  opDB.getProjectCount = async function(userId) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");

      const count = await projectsCollection.countDocuments({ ownerId: new ObjectId(userId) });

      return { count };
    } finally {
      client.close();
    }
  };

  // Get a specific project
  opDB.getProject = async function(projectId) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");

      const project = await projectsCollection.findOne({ _id: new ObjectId(projectId) });

      return project;
    } finally {
      client.close();
    }
  };

  // Create a new project
  opDB.createProject = async function(projectData) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");

      const result = await projectsCollection.insertOne(projectData);

      return result;
    } finally {
      client.close();
    }
  };

  // Create a new task
  opDB.createTask = async function(taskData) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const tasksCollection = db.collection("tasks");

      const result = await tasksCollection.insertOne(taskData);

      return result;
    } finally {
      client.close();
    }
  };

  // Get tasks for a project
  opDB.getTasks = async function(projectId) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const tasksCollection = db.collection("tasks");

      const tasks = await tasksCollection.find({ projectId: new ObjectId(projectId) }).toArray();

      return tasks;
    } finally {
      client.close();
    }
  };

  // Update task timeline state
  opDB.updateTaskTimelineState = async function(taskTimelineObject) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const tasksCollection = db.collection("tasks");

      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(taskTimelineObject.taskId) },
        { $set: { timelineState: taskTimelineObject.newState } }
      );

      return result;
    } finally {
      client.close();
    }
  };

  // Update task text
  opDB.updateTaskText = async function(taskUpdateObject) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const tasksCollection = db.collection("tasks");

      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(taskUpdateObject.taskId) },
        { $set: { text: taskUpdateObject.newText } }
      );

      return result;
    } finally {
      client.close();
    }
  };

  // Delete a task
  opDB.deleteTask = async function(taskId) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const tasksCollection = db.collection("tasks");

      const result = await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });

      return result;
    } finally {
      client.close();
    }
  };

  // Update project
  opDB.updateProject = async function(projectId, newName, newDescription) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");

      const result = await projectsCollection.updateOne(
        { _id: new ObjectId(projectId) },
        { $set: { name: newName, description: newDescription } }
      );

      return result;
    } finally {
      client.close();
    }
  };

  // Delete a project
  opDB.deleteProject = async function(projectId) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");

      const result = await projectsCollection.deleteOne({ _id: new ObjectId(projectId) });

      return result;
    } finally {
      client.close();
    }
  };

  return opDB;
}

module.exports = OpTaskDB();
