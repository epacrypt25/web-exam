# ExamApp Fullstack 🎓

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

**Frontend**:
- Framework: Next.js (React)
- Styling: Tailwind CSS
- Icons: Lucide React
- Routing & Data: Next App Router, Axios

**Backend**:
- Language: Go (1.23.6)
- Web Framework: Echo
- Database: PostgreSQL (pq driver)
- Auth: JWT (JSON Web Tokens)
- Documentation: Swagger (Go-Swagger/Echo-Swagger)

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
