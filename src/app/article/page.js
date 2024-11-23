"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabaseClient.js";
import Image from 'next/image';
import "./articledetails.css";
import OutfitDiv from "@/components/OutfitDiv";

export default function ArticleDetails() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [article, setArticle] = useState(null);
    const [images, setImages] = useState([]);
    const [styles, setStyles] = useState([]);
    const [ages, setAges] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const outfitDivRef = useRef();

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
                        .select("image_url,main_cover")
                        .eq("articleID", id);

                    if (imageError) {
                        console.error("Error fetching images:", imageError);
                    } else {
                        setImages(imageData);
                    }

                    const { data: styleData, error: styleError } = await supabase
                        .from("article_style")
                        .select("styleID")
                        .eq("articleID", id);

                    if (styleError) {
                        console.error("Error fetching styles:", styleError);
                    } else {
                        const styleIDs = styleData.map(style => style.styleID);
                        const { data: styles, error: stylesError } = await supabase
                            .from("styles")
                            .select("style_name")
                            .in("style_id", styleIDs);

                        if (stylesError) {
                            console.error("Error fetching style names:", stylesError);
                        } else {
                            setStyles(styles.map(style => style.style_name));
                        }
                    }

                    const { data: ageData, error: ageError } = await supabase
                        .from("article_age")
                        .select("ageID")
                        .eq("articleID", id);

                    if (ageError) {
                        console.error("Error fetching ages:", ageError);
                    } else {
                        const ageIDs = ageData.map(age => age.ageID);
                        const { data: ages, error: agesError } = await supabase
                            .from("age")
                            .select("age_class")
                            .in("age_id", ageIDs);

                        if (agesError) {
                            console.error("Error fetching age names:", agesError);
                        } else {
                            setAges(ages.map(age => age.age_class));
                        }
                    }

                    const { data: sizeData, error: sizeError } = await supabase
                        .from("article_size")
                        .select("sizeID")
                        .eq("articleID", id);

                    if (sizeError) {
                        console.error("Error fetching sizes:", sizeError);
                    } else {
                        const sizeIDs = sizeData.map(size => size.sizeID);
                        const { data: sizes, error: sizesError } = await supabase
                            .from("size")
                            .select("size_name")
                            .in("size_id", sizeIDs);

                        if (sizesError) {
                            console.error("Error fetching size names:", sizesError);
                        } else {
                            setSizes(sizes.map(size => size.size_name));
                        }
                    }

                    const { data: materialData, error: materialError } = await supabase
                        .from("article_material")
                        .select("materialID")
                        .eq("articleID", id);

                    if (materialError) {
                        console.error("Error fetching materials:", materialError);
                    } else {
                        const materialIDs = materialData.map(material => material.materialID);
                        const { data: materials, error: materialsError } = await supabase
                            .from("material")
                            .select("material_name")
                            .in("material_id", materialIDs);

                        if (materialsError) {
                            console.error("Error fetching material names:", materialsError);
                        } else {
                            setMaterials(materials.map(material => material.material_name));
                        }
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

    const handleAddToOutfit = () => {
        if (images.length > 0 && outfitDivRef.current) {
            const mainCoverImage = images.find(image => image.main_cover === true);
            if (mainCoverImage) {
                outfitDivRef.current.addImageToOutfit(mainCoverImage.image_url, article.articleID, article.price);
            } else {
                console.log("No main cover image found");
            }
        }
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
                <p className="styles font-AudioNugget">
                    Styles: {styles.length > 0 ? styles.join(", ") : "loading.."}
                </p>
                <p className="ages font-AudioNugget">
                    Ages: {ages.length > 0 ? ages.join(", ") : "loading.."}
                </p>
                <p className="sizes font-AudioNugget">
                    Sizes: {sizes.length > 0 ? sizes.join(", ") : "loading.."}
                </p>
                <p className="materials font-AudioNugget">
                    Materials: {materials.length > 0 ? materials.join(", ") : "loading.."}
                </p>
                <p className={"transfer-to-brand"}>
                    Go to product &rarr;
                </p>
                <p className={"transfer-to-brand"} onClick={handleAddToOutfit}>
                    Add to outfit &rarr;
                </p>
            </div>
            <OutfitDiv ref={outfitDivRef} />
        </div>
    );
}