const corsOptions = {
    origin: ["http://localhost:8000", "http://localhost:3000", "http://192.168.242.197:3000", "http://192.168.128.197:8080"],
    methods: ["GET", "POST"],
    credentials: true
};

export default corsOptions;
