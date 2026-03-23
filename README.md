<p align="center">
  # ExamApp 🎓
</p>

![Next.js](https://img.shields.io/badge/Next.js-v14.2.21-000000?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-v18.3.1-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![Go](https://img.shields.io/badge/Go-v1.25.0-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Echo](https://img.shields.io/badge/Echo-v4.15.1-black?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v1.12.0-336791?style=for-the-badge&logo=postgresql&logoColor=white)


ExamApp is a modern, responsive, and robust full-stack application for managing and participating in online examinations. Built with a Go backend and a Next.js frontend, ExamApp delivers a seamless and aesthetically pleasing experience for both administrators and students.

## 🌟 UI/UX Design

The application utilizes a sleek, bright, and premium aesthetic focusing on clear typography, vast whitespace, and vibrant brand accents:
- **Color Palette & Theme**: Features a "Light Mode" aesthetic with a highly readable `#f4f7fe` background. The primary branding color is an elegant gradient from Soft Purple (`#8A50F5`) to Deep Purple (`#7B46F1`), accented by navy text (`#2B3674`) for pristine legibility.
- **Glassmorphism & Depth**: Leverages soft shadows (`shadow-purple-500/20`), backdrop blurs, and floating cards (`.card`) to establish a clear visual hierarchy.
- **Illustrations**: Employs expressive isometric SVGs simulating a digital workspace, capturing a whimsical yet highly professional character on both the Authentication layout and the Dashboard ribbon.
- **Fully Responsive**: Features an adaptive layout:
  - **Desktop**: A persistent side navigation rail offering instantaneous access to modules.
  - **Mobile/Tablet**: Transforms into a focused top-bar layout featuring a hamburger-triggered sliding drawer (with backdrop blurs) to conserve screen real estate.
- **Feedback & Interactions**: Provides state-driven animations including spinning loaders, hover translations (`-translate-y-1`), and interactive Toast notifications.

## 🚀 Application Flow

```text
+-------------------------------------------------+
|               Register / Login                  |
+-------------------------------------------------+
                        |
                        v
+-------------------------------------------------+
|                  Role Check                     |
+-------------------------------------------------+
         |                             |
     [ Admin ]                       [ User ]
         |                             |
         v                             v
+-----------------+           +-------------------+
| Admin Dashboard |           |    Has Class?     |
+-----------------+           +-------------------+
  |            |                 |           |
  v            v               [ No ]      [ Yes ]
+-------+ +----------+           |           |
|Manage | | Manage   |           v           v
|Classes| | Exams    |    +-------------+ +---------------+
+-------+ +----------+    | Join Class  | | User Dashboard|
             |            +-------------+ +---------------+
             v                               |
        +---------+                          v
        |   Add   |               +-------------------+
        |Questions|               | View Class Exams  |
        +---------+               +-------------------+
                                             |
                                             v
                                  +-------------------+
                                  | Take Quiz (Timer) |
                                  +-------------------+
                                             |
                                             v
                                  +-------------------+
                                  |   Submit Exam     |
                                  +-------------------+
                                             |
                                             v
                                  +-------------------+
                                  |  View Final Score |
                                  +-------------------+
```

### 1. Authentication
- **Register / Login**: Users can create an account and authenticate.
- **Role Assignment**: Under the hood, users carry a role attribute (`admin` or `user`).
  
### 2. Onboarding (Standard Users)
- **Class Selection**: New users without an assigned class are intercepted by a specialized onboarding view (`Welcome to ExamApp!`). They must select an available classroom from a dropdown before accessing their dashboard. Once a class is selected, it implicitly filters all content across the application.

### 3. Dashboard Experience
- Displays a prominent greeting featuring dynamic gradients.
- Presents quick statistics and upcoming tasks visually.

### 4. Class Management (Admin Only)
- Admins can navigate to **Classes** to create, view, and organize classrooms. 
- Normal users are restricted from the Classes directory interface to keep their experience streamlined.

### 5. Exam Lifecycle
- **Creation (Admin)**: Admins create exams assigned to specific classes. Inside those exams, they can construct multiple-choice questions via an intuitive modal system, declaring options (A-D) and selecting the correct answer.
- **Participation (User)**: Regular students visit the **Exams** view which is *automatically filtered* strictly to their `class_id`. They see their assigned exams and jump directly into the "Quiz Node". They answer questions under a tight responsive timer system (30 seconds per question with a visual progress bar).
- **Completion**: Once finished, the frontend calls the backend assessment engine, automatically calculating the grade and returning a bright, confident final score popup. 

## 🛠 Tech Stack

**Frontend** (Node.js Environment):
- Framework: Next.js (`v14.2.21`) & React (`v18.3.1`)
- Styling: Tailwind CSS (`v3.4.17`)
- Icons: Lucide React (`v0.468.0`)
- HTTP Client & Routing: Axios (`v1.7.9`) & Next App Router

**Backend** (Go Runtime Environment):
- Language: Go (`v1.25.0`)
- Web Framework: Echo (`v4.15.1`)
- Database Driver: PostgreSQL (pq `v1.12.0`)
- Auth: JWT (golang-jwt `v5.3.1`)
- Documentation: Swagger (echo-swagger `v1.5.2` & swag `v1.16.6`)

## 📦 Setting Up Locally

Assuming you have `Node.js` and `Go` installed:

**1. Clone the repository**
**2. Setup Backend:**
```bash
cd backend
# Make sure postgres is running and the database matches your configuration
make run-all
```

**3. Setup Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to dive into the experience!
