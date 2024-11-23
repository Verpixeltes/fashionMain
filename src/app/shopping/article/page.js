"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient.js";
import Image from 'next/image';
import "./articledetails.css";

export default function ArticleDetails() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [article, setArticle] = useState(null);
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (id) {
            console.log("Fetching article with ID:", id);

            async function fetchArticleAndImages() {
                try {
                    const { data: articleData, error: articleError } = await supabase
                        .from("article")
                        .select(`
                            articleID,
                            name,
                            url,
                            price,
                            brand (brand_name),
                            type (type_name),
                            form (form_name)
                        `)
                        .eq("articleID", id)
                        .single();

                    if (articleError) {
                        console.error("Error fetching article:", articleError);
                        return;
                    }

                    setArticle(articleData);

                    const { data: imageData, error: imageError } = await supabase
                        .from("article_images")
                        .select("image_url")
                        .eq("articleID", id);

                    if (imageError) {
                        console.error("Error fetching images:", imageError);
                    } else {
                        setImages(imageData);
                    }
                } catch (error) {
                    console.error("Unexpected error:", error);
                }
            }

            fetchArticleAndImages();
        } else {
            console.log("No ID parameter found");
        }
    }, [id]);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + images.length) % images.length
        );
    };

    if (article === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="article-details">
            <div className="image-container">
                {images.length > 0 ? (
                    <>
                        <Image
                            className="article-image"
                            src={images[currentImageIndex].image_url}
                            alt={article.name}
                            width={600} // Set the desired width
                            height={600} // Set the desired height
                        />
                        <div className="arrow left" onClick={handlePreviousImage}></div>
                        <div className="arrow right" onClick={handleNextImage}></div>
                    </>
                ) : (
                    <div className="article-image-placeholder">
                        No images available
                    </div>
                )}
            </div>

            <div className="article-info">
                <p className="brand font-AudioNugget">
                    {article.brand?.brand_name || "No brand available"}
                </p>
                <p className="name font-AudioNugget">
                    {article.name || "No name available"}
                </p>
                <p className="price font-AudioNugget">Price: {article.price}€</p>
                <p className="form font-AudioNugget">
                    Form: {article.form?.form_name || "No form available"}
                </p>
                <p className="type font-AudioNugget">
                    Type: {article.type?.type_name || "No type available"}
                </p>
                <p className={"transfer-to-brand"}>
                    Go to product
                </p>
            </div>
        </div>
    );
}