'use client';

import { Suspense } from "react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseCLient";
import Image from 'next/image';
import "./articledetails.css";

function ArticleDetails() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [article, setArticle] = useState(null);
    const [images, setImages] = useState([]);
    const [styles, setStyles] = useState([]);
    const [ages, setAges] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [mainColor, setMainColor] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedTab, setSelectedTab] = useState('product');
    const router = useRouter();

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

                    const { data: colorData, error: colorError } = await supabase
                        .from("article_color")
                        .select("color_name, hex_code")
                        .eq("articleID", id)
                        .eq("main_color", true)
                        .single();

                    if (colorError) {
                        if (colorError.code === 'PGRST116') {
                            console.log("No main color found for this article.");
                        } else {
                            console.error("Error fetching main color:", colorError);
                        }
                    } else {
                        setMainColor(colorData);
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

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
    };

    const handleBrandClick = () => {
        if (article && article.brand) {
            router.push(`/shopping?brand=${article.brand.brand_name}`);
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
                        <div className="thumbnails-container">
                            {images.map((image, index) => (
                                <Image
                                    key={index}
                                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                    src={image.image_url}
                                    alt={`Thumbnail ${index + 1}`}
                                    width={80} // Set the desired width for thumbnails
                                    height={80} // Set the desired height for thumbnails
                                    onClick={() => handleImageClick(index)}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="article-image-placeholder">
                        No images available
                    </div>
                )}
            </div>
            <div className="article-info">
                <p className="brand font-AudioNugget" onClick={handleBrandClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                    {article.brand?.brand_name || "No brand available"}
                </p>
                <p className="name font-AudioNugget">{article.name || "No name available"}</p>
                <p className="price font-AudioNugget">{article.price}€</p>
                <div className="tabs">
                    <span className={`tab ${selectedTab === 'product' ? 'active' : ''}`} onClick={() => setSelectedTab('product')}>Product Information</span>
                    <span className={`tab ${selectedTab === 'general' ? 'active' : ''}`} onClick={() => setSelectedTab('general')}>General Information</span>
                </div>
                {selectedTab === 'product' && (
                    <div className="info-content">
                        <p className="info-text">Form: {article.form?.form_name || "No form available"}</p>
                        <p className="info-text">Type: {article.type?.type_name || "No type available"}</p>
                        <p className="info-text">Sizes: {sizes.length > 0 ? sizes.join(", ") : "No sizes available"}</p>
                        <p className="info-text">Materials: {materials.length > 0 ? materials.join(", ") : "No materials available"}</p>
                        {mainColor && (
                            <>
                                <p className="info-text">Color: {mainColor.color_name}</p>
                                <div className="color-circle" style={{ backgroundColor: mainColor.hex_code }}></div>
                            </>
                        )}
                    </div>
                )}
                {selectedTab === 'general' && (
                    <div className="info-content">
                        <p className="info-text">Styles: {styles.length > 0 ? styles.join(", ") : "loading.."}</p>
                        <p className="info-text">Ages: {ages.length > 0 ? ages.join(", ") : "loading.."}</p>
                    </div>
                )}
                <p className="go-to-product">
                    Go to product
                </p>
            </div>
        </div>
    );
}

export default function ArticlePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ArticleDetails />
        </Suspense>
    );
}