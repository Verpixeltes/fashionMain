"use client";
import { useEffect, useState } from 'react';
import { supabase } from "../lib/supabaseClient.js";
import './shoppingStyles.css';

export default function YourPage() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        async function fetchArticles() {
            try {
                // Hauptartikel abrufen
                const { data: articlesData, error: articlesError } = await supabase
                    .from('article')
                    .select(`
                        articleID,
                        name,
                        url,
                        price,
                        brand (brand_name),
                        type (type_name),
                        form (form_name)
                    `);

                if (articlesError) {
                    console.error('Error fetching articles:', articlesError);
                    return;
                }

                // Bilder für Artikel abrufen
                const articlesWithImages = await Promise.all(
                    articlesData.map(async (article) => {
                        const { data: imageData, error: imageError } = await supabase
                            .from('article_images')
                            .select('image_url')
                            .eq('articleID', article.articleID)
                            .eq('main_cover', true)
                            .limit(1); // Begrenzen auf eine Zeile

                        if (imageError) {
                            console.error(`Error fetching image for article ${article.articleID}:`, imageError.message);
                        }

                        // Standardbild setzen, falls kein Bild gefunden wurde
                        const imageUrl = imageData && imageData.length > 0
                            ? imageData[0].image_url
                            : '/default-image.jpg'; // Pfad zum Standardbild

                        return { ...article, image_url: imageUrl };
                    })
                );

                setArticles(articlesWithImages);
            } catch (error) {
                console.error('Unexpected error fetching articles:', error);
            }
        }

        fetchArticles();
    }, []);

    const handleArticleClick = (id) => {
        window.location.href = `/shopping/article?id=${id}`;
    };

    return (
        <div>
            <div className="articles-grid">
                {articles.map((article) => (
                    <div
                        key={article.articleID}
                        className="article-container"
                        onClick={() => handleArticleClick(article.articleID)}
                    >
                        <div
                            className="article-div"
                            style={{ backgroundImage: `url(${article.image_url})` }}
                        ></div>
                        <div className="text-container">
                            <p className="brand font-AudioNugget">{article.brand.brand_name}</p>
                            <p className="name font-AudioNugget">{article.name}</p>
                            <p className="price font-AudioNugget">{article.price}€</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
