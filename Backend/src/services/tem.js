const resume = `
JOHN DOE
Software & Systems Engineer
Email: john.doe@email.com | GitHub: github.com/johndoe | LinkedIn: linkedin.com/in/johndoe

SUMMARY
Detail-oriented Software Engineer with strong foundations in low-level systems, full-stack development, and IoT solutions. Experienced in building high-performance C/C++ applications, custom algorithms, Node.js microservices, and hardware-software integrations.

TECHNICAL SKILLS
- Languages: C, C++, JavaScript (ES6+), TypeScript, Python, SQL
- Backend & Systems: Node.js, Express, POSIX APIs, Multithreading, Socket Programming, System Calls
- Web & Frontend: React, HTML5/CSS3, RESTful APIs, WebSockets
- Database & Storage: PostgreSQL, MongoDB, Redis
- IoT & Hardware: ESP32, Embedded C, Sensor Integration (I2C/SPI), MQTT, Real-Time Monitoring
- Tools & DevOps: Git, Docker, Linux/Unix, GDB, Postman

EXPERIENCE
Full Stack & Systems Developer | Software Solutions Inc. | 2024 - Present
- Designed and maintained high-throughput RESTful APIs using Node.js and PostgreSQL, serving 50k+ daily active users.
- Built real-time asynchronous communication pipelines using WebSockets and Redis caching, reducing server latency by 35%.
- Implemented robust error handling, middleware authentication, and database query optimizations across backend microservices.

PROJECTS
Smart IoT Health & Environmental Monitor
- Developed an embedded health monitoring system using ESP32, integrated pulse oximeters, gas sensors, and environmental modules.
- Built a lightweight Python/Scikit-learn pipeline to process real-time biometric streams and detect anomalous readings.
- Streaming real-time sensor metrics via MQTT to a web dashboard with minimal transmission overhead.

Real-Time Directory Synchronization Engine (Mini-Dropbox)
- Implemented a lightweight, multi-threaded C directory sync engine leveraging Linux POSIX system calls and inotify API.
- Implemented client-server socket programming over TCP with custom protocol headers to ensure data integrity during transfer.

Rope Tree Text Processing Engine & Visualizer
- Built a fast, low-overhead text editor core using a custom Rope Tree data structure in C/C++ for efficient insertion and deletion on large text buffers.
- Developed an interactive tree-visualization module to analyze internal dynamic balancing and operation performance in real time.

EDUCATION
Bachelor of Science in Computer Science | University Name | Graduated 2024
- Coursework: Data Structures & Algorithms, Operating Systems, Computer Networks, Database Management, Systems Programming.
`;

const selfDescription = `
Passionate software developer with 2+ years of experience building high-performance web applications. 
Adept at backend API design, system optimization, and writing clean, maintainable code. 
Strong problem-solver who enjoys building impactful, end-to-end solutions.
`;

const jobDescription = `
Role: Backend Software Engineer
Responsibilities:
- Design, build, and maintain scalable APIs using Node.js and Express.
- Work with SQL/NoSQL databases to optimize query performance and storage.
- Collaborate with frontend teams to integrate UI components with core backend services.
Requirements:
- 2+ years of experience with Node.js/JavaScript.
- Strong understanding of RESTful architecture and database systems.
`;

module.exports = {
  resume,
  selfDescription,
  jobDescription
};