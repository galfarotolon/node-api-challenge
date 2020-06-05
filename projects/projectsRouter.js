const express = require('express')
const router = express.Router();
const ProjectDb = require('../data/helpers/projectModel');
const ActionDb = require('../data/helpers/actionModel')


//////GET REQUESTS

router.get('/', (req, res) => {
    ProjectDb.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The projects information could not be retrieved.",
            });
        });
});


router.get('/:id', (req, res) => {
    const id = req.params.id

    ProjectDb.get(id)
        .then(project => {
            if (project.length == 0) {

                res.status(404).json({ message: "The project with the specified ID does not exist." });

            } else {
                res.status(200).json(project);
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The project information could not be retrieved.",
            });
        });
});

router.get('/:id/actions', (req, res) => {

    const id = req.params.id


    ProjectDb.getProjectActions(id)
        .then(actions => {
            if (actions.length == 0) {

                res.status(404).json({ message: "The project with the specified ID does not exist." });
            }
            else {
                res.status(200).json(actions);
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The actions information for this project could not be retrieved.",
            });
        });
});

//////POST REQUESTS

router.post('/', (req, res) => {
    const newProject = req.body;


    if (!newProject.name || !newProject.description) {

        res.status(400).json({ errorMessage: "Please provide name and description for the Project." })

    } else {

        try {
            ProjectDb.insert(newProject)
                .then(project => {
                    res.status(201).json(project);
                })

        } catch{

            res.status(500).json({ error: "There was an error while saving the project to the database" })
        }
    }
})


router.post('/:id/actions', (req, res) => {
    const { id } = req.params;
    const action = { ...req.body, project_id: id };

    ProjectDb.get(id)
        .then(project => {
            if (project) {
                if (!action.description || !action.project_id || !action.notes) {

                    res.status(400).json({ errorMessage: "Please more info for the action." });

                } else {
                    ActionDb.insert(action)
                        .then(newAction => {
                            res.status(201).json(newAction);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: "There was an error while saving to the database"
                            });
                        });
                }
            } else {
                res.status(404).json({ message: "The project with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "There was an error while saving the action to the database."
            });
        });
})




//////////////PUT REQUEST

router.put('/:id', (req, res) => {
    const changes = req.body;
    ProjectDb.update(req.params.id, changes)
        .then(project => {
            if (project) {
                res.status(200).json(project);
            } else {
                res.status(404).json({ message: "The project with the specified ID does not exist." });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The project information could not be modified.",
            });
        });
});

/////////DELETE REQUEST

router.delete('/:id', (req, res) => {
    ProjectDb.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'The project has been deleted.' });
            } else {
                res.status(404).json({ message: "The project with the specified ID does not exist." });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The project could not be removed",
            });
        });
});



module.exports = router; 