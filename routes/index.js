var express = require('express');
var passport = require('passport');
var multer = require('multer');
var router = express.Router();

var uploading = multer({
    dest: './public/uploads/'
});


// chat room modules
var chatRoomRoute = require("./chat/chat-room");
var createChannelRoute = require("./chat/chat-api/create-channel");
var updateEmailNotificationRoute = require('./chat/chat-api/update-email-notification');
var searchMessagesRoute = require('./chat/chat-api/search-messages');
router.get('/chat-room', ensureAuthenticated, chatRoomRoute);
router.get('/chat-api/create-channel/:channelName', ensureAuthenticated, createChannelRoute);
router.post('/chat-api/update-email-notification/:setting', ensureAuthenticated, updateEmailNotificationRoute);
router.get('/chat-api/search-messages/:message', ensureAuthenticated, searchMessagesRoute);


// queued modules
var requirementsRoute = require("./queued/queued");
var addProjectRoute = require("./queued/addProject");     // route for creating new project
var editProject	     = require("./queued/editProject");                     // Route for Editing a project
var saveProjectAfterEdit = require("./queued/saveProjectAfterEdit");
var saveProjectRoute = require("./queued/saveProject");
var viewProjectRoute = require("./queued/viewProject");   // View detail stories of a specific project
var addStoryRoute = require("./queued/addStory");         // Route for View to add a new story to a project
var saveStoryRoute = require("./queued/saveStory");       // Route for Save a new story to a project with Id
var viewStoryDetailRoute = require ("./queued/viewStory");// Route for View detail of a story
var deleteStoryRoute = require("./queued/deleteStory");   // Route for Delete a story
var updateStoryRoute = require("./queued/updateStory");   // Route for Update a story

// router.get for queued
router.get('/queued', ensureAuthenticated, requirementsRoute);
router.get('/queued/editProject/:projectId', ensureAuthenticated, editProject);
router.get('/queued/:add', ensureAuthenticated, addProjectRoute);
router.get('/queued/project/:projectId', ensureAuthenticated, viewProjectRoute);
router.get('/queued/project/:projectId/story-create', ensureAuthenticated, addStoryRoute);
router.get('/queued/project/:projectId/:storyId', ensureAuthenticated, viewStoryDetailRoute);

// router.post for queuedS
router.post('/queued/project/:projectId/story-create', ensureAuthenticated, saveStoryRoute);
router.post('/queued/project/:projectId/:storyId/story-delete', ensureAuthenticated, deleteStoryRoute);
router.post('/queued/project/:projectId/:storyId/story-update', ensureAuthenticated, updateStoryRoute);
router.post('/queued/:add', ensureAuthenticated, saveProjectRoute);
router.post('/queued/editProject/:projectId', ensureAuthenticated, saveProjectAfterEdit);


// issue modules
var bugsRoute = require("./bugs/bugs-log");
var bugsJSONRoute = require("./bugs/bugs-json");
var bugsCreateRoute = require("./bugs/bugs-create");
var bugsPreviewRoute = require("./bugs/bugs-preview");
var bugsDetailRoute = require("./bugs/bugs-detail");
var bugsSaveRoute = require("./bugs/bugs-save");
var bugsDeleteRoute = require("./bugs/bugs-archive");
var bugsUploadImageRoute = require("./bugs/bugs-upload-image");
var bugsAddCommentRoute = require("./bugs/bugs-add-comment");

router.get('/bugs', ensureAuthenticated, bugsRoute); // route for returning issue log view
router.get('/bugs/create', ensureAuthenticated, bugsCreateRoute.displayCreateIssue); // route for returning an empty create issue page
router.get('/bugs/data.json', ensureAuthenticated, bugsJSONRoute); // route for returning issue data for log view
router.get('/bugs/issue/:id', ensureAuthenticated, bugsDetailRoute); // route for returning an issue detail view

router.post('/bugs/create', ensureAuthenticated, bugsCreateRoute.createIssue); // route for creating an issue in the database
router.post('/bugs/preview', ensureAuthenticated, bugsPreviewRoute); // preview markdown for create issue
router.post('/bugs/issue/:id', ensureAuthenticated, bugsSaveRoute); // route for saving an updated issue detail page
router.post('/bugs/issue/:id/archive', ensureAuthenticated, bugsDeleteRoute); // route for archiving an issue
router.post('/bugs/bugs-upload-image/:id', ensureAuthenticated, bugsUploadImageRoute); // route for saving an image to the database
router.post('/bugs/upload', ensureAuthenticated, uploading.single('image'), bugsUploadImageRoute); // route for uploading an image
router.post('/bugs/issue/:id/comment', ensureAuthenticated, bugsAddCommentRoute); // route for adding a comment to an issue detail page

// shared modules
var loginRoute = require("./login");
var homeRoute = require("./home");
var settingsRoute = require("./settings");

router.get('/', homeRoute);
router.get('/settings', ensureAuthenticated, settingsRoute);
router.get('/login', loginRoute);
router.get('/auth/github', passport.authenticate('github', {scope: ['user:email']}));
router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


module.exports = router;

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}
