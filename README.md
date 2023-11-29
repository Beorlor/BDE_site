Site pour la campagne BDE,
Premiere page, un login qui redirige vers le login 42
Si la connection est accepter et que l'on obtient le token,
verifier que la personne a pas deja remplie le formulaire,
si la personne na pas remplie le formulaire, la rediriger vers.

On utilise l'api 42 pour empecher les doubles submissions de formulaire

Verifier aussi quand une submission de formulaire est faite, que la personne ne l'ai pas deja submit pour eviter les doubles submit forcer (user malveillant)

Base de Donnee (PostgreSQL ?)

1 : To not hardcode the 42 key into the code (dotenv)

You can install them with npm install dotenv express axios crypto.

.env File
Create a .env file at the root of your project and add your 42 API credentials:

CLIENT_ID=yourClientID
CLIENT_SECRET=yourClientSecret

///////////////////////////////////////////////////

TODO :

To redirect users to a form after logging in via the 42 API and ensure they can't submit the form more than once, you'll need to implement a mechanism to track user submissions. The 42 API will handle user authentication, but it doesn't manage user session or submission tracking on your application. You'll need to implement this on your server. Here's a step-by-step approach:

Step 1: User Authentication with 42 API
Continue using your current setup for authenticating users via the 42 API. Once authenticated, you'll receive an access token that you can use to identify the user.

Step 2: Session Management
After authentication, you should create a session for the user. You can use a package like express-session for session management in Express.

Install express-session: Run npm install express-session.

Configure Session Middleware:

javascript
Copy code
const session = require('express-session');

app.use(session({
    secret: 'your_secret_key', // choose a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // set secure to true if using https
}));
Step 3: Track User Submissions
Once the user is authenticated and a session is established, you need a way to track whether they have already submitted the form.

You can store this information in a database, with each record containing the user's unique identifier from the 42 API and a flag indicating whether they have submitted the form.
Alternatively, for a simpler approach, you could store this information in the session, though this is less reliable as sessions can expire or be cleared.
Step 4: Redirecting to the Form
After authentication and session setup, redirect the user to the form. Before showing the form, check whether they have already submitted it.

If they have not submitted the form, show the form.
If they have already submitted the form, show a message indicating that they cannot submit it again.
Step 5: Handling Form Submission
When the form is submitted, mark in your database or session that this user has submitted the form. Check this mark on every subsequent visit to prevent multiple submissions.

Step 6: Security and User Experience Considerations
Ensure that the session and user identification are securely handled to prevent unauthorized access or manipulation.
Provide clear messages to users if they're trying to access the form a second time.
Consider the user experience for those who might lose their session – decide how strictly you want to enforce the one-time submission rule.
Example Code Snippet for Session and Submission Tracking
This is a hypothetical example of how you might handle a user session and check for form submissions:

javascript
Copy code
app.get('/form', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // User not authenticated
    }

    if (req.session.formSubmitted) {
        return res.send('You have already submitted the form.');
    }

    // Show the form
    res.send('<form>...</form>'); // Your form HTML here
});

app.post('/submit-form', (req, res) => {
    if (req.session.formSubmitted) {
        return res.send('You have already submitted the form.');
    }

    // Process form submission here

    req.session.formSubmitted = true;
    res.send('Form submitted successfully.');
});
In this example, userId and formSubmitted are properties in the session that track the user's identity and whether they've submitted the form, respectively. This is a basic implementation and would need to be adapted based on how you're handling user data and sessions in your application.
