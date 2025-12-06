import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 200, // 200 users at same time
  duration: "30s", // run the test for 30 seconds
};

export default function () {
  const url =
    "http://localhost:5001/api/messages/send/690f8a3e880072448eb06bee"; // replace USER_ID

  const payload = JSON.stringify({
    text: "Hello from k6 load test!",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      Cookie:
        "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTE0YjllMzIyOGVjZmJkZTc3NmJhNGYiLCJpYXQiOjE3NjMzMDE1MTksImV4cCI6MTc2MzkwNjMxOX0.vRGt7VrVQjjihT-SHm-HdG8PBDs7uCTWcsodc7URozc",
    },
  };

  http.post(url, payload, params);

  sleep(1);
}
