A decently styled, responsive web application that allows users to log their nutrition meals, track their calorie intake, view and review their macronutrient breakdowns through visual charts, and monitor their friends and their own weekly nutrition trends. This web app was built using React and Firebase.

Features:
- Authentication (users can sign up and in, which is managed within Firebase Auth)
- Meal Logging (Manually can add meals with specific values OR use the Nutritionix API V2 to search for food items to add to their meal log)
- Macronutrient Breakdowns (Displays daily protein, carbs and fat visualised in a pie chart)
- Weekly Calorie Trend (View progress over time)
- Friend feature (Search for existing users via their email, send and accept friend requests to view their stats)
- Calendar View (Select any date to view meals logged for that day)
- Real-time data (All data is stored within Firestore)

  How to use the project:
1. Clone the repository
   git clone https://github.com/your-username/calorie-tracker-app.git
cd calorie-tracker-app

2. Install the dependencies
npm install

3. Running with Firebase
   1. Go to the Firebase console
   2. Click **'add project'** follow the setup steps
   3. Enable **authentication** (Such as email/password)
   4. Enable the **Firestore Database** (you will be using test mode)
      

5. Set up environment variables
Create a .env file at the root with:
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_NUTRITIONIX_APP_ID=your_nutritionix_app_id
VITE_NUTRITIONIX_APP_KEY=your_nutritionix_app_key

6. Run the app
   npm run dev

This project is free to use. This project does use a Blaze subscription.

Contact @ 220224170@aston.ac.uk to get Zion Pemberton for support!
