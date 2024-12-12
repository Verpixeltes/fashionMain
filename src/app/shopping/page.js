"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import didYouMean from 'didyoumean2';
import { supabase } from "../lib/supabaseCLient.js";
import './shoppingStyles.css';

function YourPageContent() {
    const [articles, setArticles] = useState([]);
    const [types, setTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [expandedTypes, setExpandedTypes] = useState({});
    const [searchInitiated, setSearchInitiated] = useState(false);
    const searchParams = useSearchParams();
    const brandFilter = searchParams.get('brand');

    useEffect(() => {
        async function fetchArticles() {
            try {
                const { data: articlesData, error: articlesError } = await supabase
                    .from('article')
                    .select(`
                        articleID,
                        name,
                        url,
                        price,
                        brand (brand_name),
                        type,
                        form (form_name),
                        article_style (styleID),
                        article_age (ageID),
                        article_size (sizeID),
                        article_material (materialID)
                    `);

                if (articlesError) {
                    console.error('Error fetching articles:', articlesError);
                    return;
                }

                const articlesWithDetails = await Promise.all(
                    articlesData.map(async (article) => {
                        const { data: typeData, error: typeError } = await supabase
                            .from('type')
                            .select('type_name')
                            .eq('type_id', article.type)
                            .single();

                        if (typeError) {
                            console.error(`Error fetching type for article ${article.articleID}:`, typeError.message);
                        }

                        const { data: imageData, error: imageError } = await supabase
                            .from('article_images')
                            .select('image_url')
                            .eq('articleID', article.articleID)
                            .eq('main_cover', true)
                            .limit(1);

                        if (imageError) {
                            console.error(`Error fetching image for article ${article.articleID}:`, imageError.message);
                        }

                        const imageUrl = imageData && imageData.length > 0
                            ? imageData[0].image_url
                            : '/path/to/default-image.jpg'; // Ensure this path is correct

                        const { data: styleData, error: styleError } = await supabase
                            .from('styles')
                            .select('style_name')
                            .in('style_id', article.article_style.map(style => style.styleID));

                        if (styleError) {
                            console.error(`Error fetching styles for article ${article.articleID}:`, styleError.message);
                        }

                        const { data: ageData, error: ageError } = await supabase
                            .from('age')
                            .select('age_class')
                            .in('age_id', article.article_age.map(age => age.ageID));

                        if (ageError) {
                            console.error(`Error fetching ages for article ${article.articleID}:`, ageError.message);
                        }

                        const { data: sizeData, error: sizeError } = await supabase
                            .from('size')
                            .select('size_name')
                            .in('size_id', article.article_size.map(size => size.sizeID));

                        if (sizeError) {
                            console.error(`Error fetching sizes for article ${article.articleID}:`, sizeError.message);
                        }

                        const { data: materialData, error: materialError } = await supabase
                            .from('material')
                            .select('material_name')
                            .in('material_id', article.article_material.map(material => material.materialID));

                        if (materialError) {
                            console.error(`Error fetching materials for article ${article.articleID}:`, materialError.message);
                        }

                        const { data: colorData, error: colorError } = await supabase
                            .from('article_color')
                            .select('color_name, color_percentage')
                            .eq('articleID', article.articleID);

                        if (colorError) {
                            console.error(`Error fetching colors for article ${article.articleID}:`, colorError.message);
                        }

                        return {
                            ...article,
                            type: typeData ? typeData.type_name : 'Unknown',
                            image_url: imageUrl,
                            styles: styleData ? styleData.map(style => style.style_name) : [],
                            ages: ageData ? ageData.map(age => age.age_class) : [],
                            sizes: sizeData ? sizeData.map(size => size.size_name) : [],
                            materials: materialData ? materialData.map(material => material.material_name) : [],
                            colors: colorData ? colorData.map(color => ({ name: color.color_name, percentage: color.color_percentage })) : []
                        };
                    })
                );

                setArticles(articlesWithDetails);
                setFilteredArticles(articlesWithDetails);

                const uniqueTypes = [...new Set(articlesWithDetails.map(article => article.type))];
                setTypes(uniqueTypes);
            } catch (error) {
                console.error('Unexpected error fetching articles:', error);
            }
        }

        fetchArticles();
    }, []);

    useEffect(() => {
        if (brandFilter) {
            setFilteredArticles(articles.filter(article => article.brand.brand_name === brandFilter));
        } else {
            setFilteredArticles(articles);
        }
    }, [brandFilter, articles]);

    const handleArticleClick = (id) => {
        window.location.href = `/article?id=${id}`;
    };

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        if (searchTerm.trim() === '') {
            setFilteredArticles(articles);
            return;
        }

        const allSearchableText = articles.flatMap(article => [
            article.name.toLowerCase(),
            article.brand.brand_name.toLowerCase(),
            article.type.toLowerCase(),
            ...article.styles.map(style => style.toLowerCase()),
            ...article.ages.map(age => age.toLowerCase()),
            ...article.sizes.map(size => size.toLowerCase()),
            ...article.materials.map(material => material.toLowerCase()),
            ...article.colors.map(color => color.name.toLowerCase())
        ]);
        const correctedTerm = didYouMean(searchTerm, allSearchableText) || searchTerm;

        const fuse = new Fuse(articles, {
            keys: [
                'name',
                'brand.brand_name',
                'type',
                'styles',
                'ages',
                'sizes',
                'materials',
                'colors.name'
            ],
            threshold: 0.3,
            getFn: (obj, path) => {
                const value = Fuse.config.getFn(obj, path);
                return typeof value === 'string' ? value.toLowerCase() : value;
            }
        });

        const result = fuse.search(correctedTerm);

        const filteredResults = result.filter(({ item }) => {
            const searchTerms = correctedTerm.split(' ');
            return searchTerms.every(term => {
                return (
                    item.name.toLowerCase().includes(term) ||
                    item.brand.brand_name.toLowerCase().includes(term) ||
                    item.type.toLowerCase().includes(term) ||
                    item.styles.some(style => style.toLowerCase().includes(term)) ||
                    item.ages.some(age => age.toLowerCase().includes(term)) ||
                    item.sizes.some(size => size.toLowerCase().includes(term)) ||
                    item.materials.some(material => material.toLowerCase().includes(term)) ||
                    item.colors.some(color => color.name.toLowerCase().includes(term))
                );
            });
        });

        setFilteredArticles(filteredResults.map(({ item }) => item));
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setSearchInitiated(true);
        }
    };

    const groupArticlesByType = (articles) => {
        return articles.reduce((acc, article) => {
            const type = article.type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(article);
            return acc;
        }, {});
    };

    const handleShowMore = (type) => {
        setExpandedTypes((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const articlesToShow = 5; // Number of articles to show initially
    const groupedArticles = groupArticlesByType(filteredArticles);

    return (
        <div className={`page-container ${searchInitiated ? 'search-initiated' : ''}`}>
            <input
                type="text"
                placeholder="You can search here..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
                className="search-input"
            />
            {searchInitiated && types.map((type) => (
                <div key={type} style={{ display: expandedTypes[type] || !Object.values(expandedTypes).includes(true) ? 'block' : 'none' }}>
                    <h2 className="category-title">{type}</h2>
                    <div className="articles-grid">
                        {groupedArticles[type]
                            ?.slice(0, expandedTypes[type] ? groupedArticles[type].length : articlesToShow)
                            .map((article) => (
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
                    {groupedArticles[type]?.length > articlesToShow && (
                        <div className="show-more-container">
                            <button className="show-more-button" onClick={() => handleShowMore(type)}>
                                {expandedTypes[type] ? "Show less" : "Show more"}
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function YourPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <YourPageContent />
        </Suspense>
    );
}