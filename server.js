const action = require("./data/helpers/actionModel");
const project = require("./data/helpers/projectModel");

const express = require("express");
const port = 5500;

const server = express();

server.use(express.json());

// ================ MiddleWare ======================

const generalErrorHelper = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
  return;
};

// ===================== Projects ====================

server.get("/api/projects", (req, res) => {
  project
    .get()
    .then(projectRes => {
      res.json(projectRes);
    })
    .catch(error => {
      generalErrorHelper(404, "Project not found", res);
    });
});

server.get('/api/projects/:id', (req, res) => {
    const { id } = req.params
    project
    .get(id)
    .then(projectIdRes => {
        if(projectIdRes === 0 ) {
            return generalErrorHelper(404, 'Project does not exist', res);
        } else {
            res.json(projectIdRes);
        }
    })
    .catch(error => {
        generalErrorHelper(505, 'Database Error', res);
    });
});

server.post("/api/projects", (req, res) => {
    const { name, description, completed } = req.body;
    project
      .insert({ name, description, completed })
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        return generalErrorHelper(500, "Database error", res);
      });
  });

  server.put("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const { name, description, completed } = req.body;
    project
      .update(id, { name, description, completed })
      .then(updatePro => {
        if (updatePro=== 0) {
          return generalErrorHelper(404, "No Action by that ID", res);
        } else {
          db.find(id).then(ud => {
            res.json(ud);
          })
        }
      })
      .catch(error => {
        return generalErrorHelper(500, "Database Error", res);
      });
  });

  server.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    project
      .remove(id)
      .then(removeProject => {
        if (removeProject === 0) {
          return generalErrorHelper(404, "No Project by that ID", res);
        } else {
          res.json({ success: "Project Removed " });
        }
      })
      .catch(error => {
        return generalErrorHelper(500, "Database Error", res);
      });
  });
// ============ Action EndPoints ==================

server.get("/api/projects/actions", (req, res) => {
  action
    .get()
    .then(foundActions => {
      res.json(foundActions);
    })
    .catch(error => {
      return generalErrorHelper(500, "Database error", res);
    });
});

server.post("/api/projects/actions", (req, res) => {
  const { project_id, description, notes, completed } = req.body;
  action
    .insert({ project_id, description, notes, completed })
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      return generalErrorHelper(500, "Database error", res);
    });
});

server.get("/api/projects/actions/:id", (req, res) => {
  const { id } = req.params;
  action
    .get(id)
    .then(actionID => {
      if (actionID.length === 0) {
        generalErrorHelper(404, "User not found", res);
        return;
      }
      res.json(actionID);
    })
    .catch(error => {
      return generalErrorHelper(500, "Database Error", res);
    });
});

server.delete("/api/projects/actions/:id", (req, res) => {
  const { id } = req.params;
  action
    .remove(id)
    .then(removeAction => {
      if (removeAction === 0) {
        return generalErrorHelper(404, "No Action by that ID", res);
      } else {
        res.json({ success: "Action Removed " });
      }
    })
    .catch(error => {
      return generalErrorHelper(500, "Database Error", res);
    });
});

server.put("/api/projects/actions/:id", (req, res) => {
  const { id } = req.params;
  const { project_id, description, notes, completed } = req.body;
  action
    .update(id, { project_id, description, notes, completed })
    .then(updateAction => {
      if (updateAction === 0) {
        return generalErrorHelper(404, "No Action by that ID", res);
      } else {
        db.find(id).then(ud => {
          res.json(ud);
        })
      }
    })
    .catch(error => {
      return generalErrorHelper(500, "Database Error", res);
    });
});

server.listen(port, () => console.log(`Server listening on ${port}`));
