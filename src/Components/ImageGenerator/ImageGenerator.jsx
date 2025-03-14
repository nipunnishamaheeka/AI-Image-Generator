import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import default_image from "../Assets/efault_image.jpeg";

export const ImageGenerator = () => {
  const [image_url, setImageUrl] = useState("/");
  let inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const imageGenerator = async () => {
    if (inputRef.current.value === "") {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            prompt: `${inputRef.current.value}`,
            n: 1,
            size: "512x512",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      let data = await response.json();
      console.log("API Response:", data);

      if (data && data.data && data.data.length > 0) {
        setImageUrl(data.data[0].url);
      } else {
        console.error("No images returned from API.");
        alert("No images generated. Try again with a different prompt.");
      }
    } catch (error) {
      console.error("Error fetching the image:", error);
      alert("Failed to generate the image. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai_image-generator">
      <div className="header">
        Ai Image <span>Generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img
            className="default-img"
            src={image_url === "/" ? default_image : image_url}
            alt=""
          />
          <div className="loading">
            <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
            <div className={loading ? "loading-text" : "display-none"}>Loading....</div>
          </div>
        </div>
      </div>
      <div className="search-box">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Describe your image"
        />
        <div
          className="generate-btn" 
          onClick={() => {
            imageGenerator();
          }}
        >
          Generate
        </div>
      </div>
    </div>
  );
};
