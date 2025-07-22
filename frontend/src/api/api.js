
let data = [
      {
        id: 1,
        fullname: "Manish Kumar",
        username: "@manishkumar07",
        isVerified: true,
        avatar: "./assets/my-av.jpeg",
        title: "The Future of Web Development: Trends to Watch in 2025",
        desc: "Web development continues to evolve at a rapid pace, with new technologies, frameworks, and methodologies emerging regularly. As we progress through 2025, several key trends are shaping the future...",
        banner: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
        timestamp: "2 min ago",
        publishDate: "July 21, 2025",
        readTime: "8 min read",
        views: "1.2k",
        likes: 24,
        comments: 8,
        bookmarked: false,
        tags: ["Web Development", "Technology", "Programming", "Future Tech"],
        content: `
          <p>Web development continues to evolve at a rapid pace, with new technologies, frameworks, and methodologies emerging regularly. As we progress through 2025, several key trends are shaping the future of how we build and interact with web applications.</p>

          <h2>1. The Rise of AI-Powered Development</h2>
          <p>Artificial Intelligence is revolutionizing the way we approach web development. From AI-assisted code generation to intelligent debugging tools, developers are increasingly leveraging AI to streamline their workflows and improve productivity.</p>

          <p>Modern AI tools like GitHub Copilot, ChatGPT, and specialized development assistants are becoming integral parts of the development process. These tools help with everything from writing boilerplate code to optimizing complex algorithms.</p>

          <h2>2. WebAssembly (WASM) Mainstream Adoption</h2>
          <p>WebAssembly has moved beyond experimental status and is now being widely adopted for performance-critical web applications. It allows developers to run code written in languages like C++, Rust, and Go directly in the browser at near-native speeds.</p>

          <h3>Key Benefits of WebAssembly:</h3>
          <p>• Near-native performance for web applications<br>
          • Ability to use existing codebases in web environments<br>
          • Enhanced security through sandboxed execution<br>
          • Cross-platform compatibility</p>

          <h2>3. Progressive Web Apps (PWAs) Evolution</h2>
          <p>Progressive Web Apps continue to blur the line between web and native applications. With improved browser support and new capabilities, PWAs are becoming a viable alternative to traditional mobile apps for many use cases.</p>

          <p>Recent advancements in PWA technology include better offline functionality, improved push notifications, and enhanced integration with device APIs. Major companies like Twitter, Pinterest, and Starbucks have successfully implemented PWAs, demonstrating their potential for large-scale applications.</p>

          <h2>4. The Jamstack Architecture</h2>
          <p>Jamstack (JavaScript, APIs, and Markup) architecture has gained significant traction for building fast, secure, and scalable web applications. This approach decouples the frontend from the backend, enabling developers to create highly performant websites with improved developer experience.</p>

          <h2>Conclusion</h2>
          <p>The web development landscape in 2025 is characterized by a focus on performance, developer experience, and user engagement. As these trends continue to evolve, developers who stay current with these technologies will be well-positioned to build the next generation of web applications.</p>

          <p>Whether you're a seasoned developer or just starting your journey, understanding these trends will help you make informed decisions about which technologies to learn and adopt in your projects.</p>
        `,
        relatedPosts: [
          {
            id: 2,
            title: "Getting Started with React 18: New Features and Improvements",
            desc: "Learn about the latest features in React 18 and how they can improve your development workflow.",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=80&h=60&fit=crop"
          },
          {
            id: 3,
            title: "CSS Grid vs Flexbox: When to Use Which",
            desc: "A comprehensive guide to understanding the differences between CSS Grid and Flexbox.",
            image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=80&h=60&fit=crop"
          },
          {
            id: 4,
            title: "Building Scalable APIs with Node.js and Express",
            desc: "Best practices for creating robust and scalable backend APIs using Node.js and Express framework.",
            image: "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=80&h=60&fit=crop"
          }
        ]
      },
      {
        id: 2,
        fullname: "Manpreet",
        username: "@manpreet02",
        isVerified: false,
        avatar: "./assets/my-av.jpeg",
        title: "Getting Started with React 18: New Features and Improvements",
        desc: "React 18 introduces several groundbreaking features that enhance performance, user experience, and developer productivity. This comprehensive guide explores the most important updates...",
        banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
        timestamp: "5 min ago",
        publishDate: "July 20, 2025",
        readTime: "6 min read",
        views: "856",
        likes: 18,
        comments: 5,
        bookmarked: false,
        tags: ["React", "JavaScript", "Frontend", "Development"],
        content: `
          <p>React 18 introduces several groundbreaking features that enhance performance, user experience, and developer productivity. This comprehensive guide explores the most important updates and how to implement them in your projects.</p>

          <h2>Concurrent Features</h2>
          <p>The most significant addition in React 18 is the introduction of concurrent features. These allow React to interrupt, pause, or abandon rendering work to keep the application responsive.</p>

          <h2>Automatic Batching</h2>
          <p>React 18 automatically batches multiple state updates into a single re-render for better performance, even inside promises, setTimeout, and native event handlers.</p>

          <h2>Suspense Improvements</h2>
          <p>Enhanced Suspense capabilities make it easier to handle loading states and code splitting in your applications.</p>
        `,
        relatedPosts: [
          {
            id: 1,
            title: "The Future of Web Development: Trends to Watch in 2025",
            desc: "Explore the latest trends shaping web development in 2025.",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=80&h=60&fit=crop"
          }
        ]
      },
      {
        id: 3,
        fullname: "Guest",
        username: "@guest07",
        isVerified: false,
        avatar: "./assets/my-av.jpeg",
        title: "CSS Grid vs Flexbox: When to Use Which",
        desc: "Understanding the differences between CSS Grid and Flexbox is crucial for modern web developers. This guide helps you choose the right tool for your layout needs...",
        banner: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
        timestamp: "10 min ago",
        publishDate: "July 19, 2025",
        readTime: "5 min read",
        views: "642",
        likes: 15,
        comments: 3,
        bookmarked: false,
        tags: ["CSS", "Layout", "Web Design", "Frontend"],
        content: `
          <p>Understanding the differences between CSS Grid and Flexbox is crucial for modern web developers. Both are powerful layout systems, but they excel in different scenarios.</p>

          <h2>When to Use Flexbox</h2>
          <p>Flexbox is ideal for one-dimensional layouts, component-level design, and when you need to distribute space along a single axis.</p>

          <h2>When to Use CSS Grid</h2>
          <p>CSS Grid excels at two-dimensional layouts, page-level design, and when you need precise control over both rows and columns.</p>

          <h2>Combining Both</h2>
          <p>The most powerful approach is often combining both Grid and Flexbox in the same project, using each where it performs best.</p>
        `,
        relatedPosts: [
          {
            id: 1,
            title: "The Future of Web Development: Trends to Watch in 2025",
            desc: "Explore the latest trends shaping web development in 2025.",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=80&h=60&fit=crop"
          }
        ]
      }
    ];

    // API Functions
    export function getBlogById(id) {
      return data.find(blog => blog.id === parseInt(id));
    }

    export function getAllBlogs() {
      return data;
    }

    export function updateBlogLikes(id, increment = true) {
      const blog = getBlogById(id);
      if (blog) {
        blog.likes += increment ? 1 : -1;
        return blog.likes;
      }
      return 0;
    }

    export function toggleBookmark(id) {
      const blog = getBlogById(id);
      if (blog) {
        blog.bookmarked = !blog.bookmarked;
        return blog.bookmarked;
      }
      return false;
    }

    export { data };