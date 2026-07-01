-- Migration: 013_headshot_style_localized_text
-- Description: Populate localized display names for headshot styles. Prompts and negative prompts are intentionally unchanged.

BEGIN;

WITH translations(id, localized_names) AS (
  VALUES
    ('linkedin_professional', jsonb_build_object('es', 'LinkedIn profesional', 'fr', 'LinkedIn professionnel', 'de', 'LinkedIn Profilbild', 'ja', 'LinkedInプロフィール')),
    ('corporate_office', jsonb_build_object('es', 'Oficina corporativa', 'fr', 'Bureau corporate', 'de', 'Corporate Office', 'ja', '企業オフィス')),
    ('business_casual', jsonb_build_object('es', 'Business casual', 'fr', 'Business casual', 'de', 'Business Casual', 'ja', 'ビジネスカジュアル')),
    ('executive_portrait', jsonb_build_object('es', 'Retrato ejecutivo', 'fr', 'Portrait dirigeant', 'de', 'Executive Portrait', 'ja', 'エグゼクティブポートレート')),
    ('doctor_whitecoat', jsonb_build_object('es', 'Medico con bata', 'fr', 'Medecin en blouse', 'de', 'Arzt im Kittel', 'ja', '白衣の医師')),
    ('modern_tech', jsonb_build_object('es', 'Tecnologia moderna', 'fr', 'Tech moderne', 'de', 'Moderne Tech', 'ja', 'モダンテック')),
    ('creative_agency', jsonb_build_object('es', 'Agencia creativa', 'fr', 'Agence creative', 'de', 'Kreativagentur', 'ja', 'クリエイティブエージェンシー')),
    ('oil_painting', jsonb_build_object('es', 'Pintura al oleo', 'fr', 'Peinture a l huile', 'de', 'Oelgemaelde', 'ja', '油絵')),
    ('watercolor_art', jsonb_build_object('es', 'Acuarela', 'fr', 'Aquarelle', 'de', 'Aquarell', 'ja', '水彩画')),
    ('anime_illustration', jsonb_build_object('es', 'Ilustracion anime', 'fr', 'Illustration anime', 'de', 'Anime Illustration', 'ja', 'アニメイラスト')),
    ('cyberpunk_neon', jsonb_build_object('es', 'Neon cyberpunk', 'fr', 'Neon cyberpunk', 'de', 'Cyberpunk Neon', 'ja', 'サイバーパンクネオン')),
    ('pixel_art_retro', jsonb_build_object('es', 'Pixel art retro', 'fr', 'Pixel art retro', 'de', 'Retro Pixel Art', 'ja', 'レトロピクセルアート')),
    ('pop_art_comic', jsonb_build_object('es', 'Comic pop art', 'fr', 'Comic pop art', 'de', 'Pop-Art Comic', 'ja', 'ポップアートコミック')),
    ('coffee_shop', jsonb_build_object('es', 'Cafeteria', 'fr', 'Cafe', 'de', 'Coffeeshop', 'ja', 'カフェ')),
    ('beach_golden_hour', jsonb_build_object('es', 'Playa al atardecer', 'fr', 'Plage golden hour', 'de', 'Strand zur goldenen Stunde', 'ja', '夕暮れのビーチ')),
    ('autumn_park', jsonb_build_object('es', 'Parque de otono', 'fr', 'Parc d automne', 'de', 'Herbstpark', 'ja', '秋の公園')),
    ('city_street', jsonb_build_object('es', 'Calle urbana', 'fr', 'Rue urbaine', 'de', 'Stadtstrasse', 'ja', '街角')),
    ('library_study', jsonb_build_object('es', 'Biblioteca', 'fr', 'Bibliotheque', 'de', 'Bibliothek', 'ja', '図書館')),
    ('garden_spring', jsonb_build_object('es', 'Jardin de primavera', 'fr', 'Jardin printanier', 'de', 'Fruehlingsgarten', 'ja', '春の庭')),
    ('spring_blossom', jsonb_build_object('es', 'Flores de primavera', 'fr', 'Fleurs de printemps', 'de', 'Fruehlingsblueten', 'ja', '春の花')),
    ('summer_sunshine', jsonb_build_object('es', 'Sol de verano', 'fr', 'Soleil d ete', 'de', 'Sommersonne', 'ja', '夏の日差し')),
    ('autumn_foliage', jsonb_build_object('es', 'Hojas de otono', 'fr', 'Feuillage d automne', 'de', 'Herbstlaub', 'ja', '秋の紅葉')),
    ('winter_snow', jsonb_build_object('es', 'Nieve de invierno', 'fr', 'Neige d hiver', 'de', 'Winterschnee', 'ja', '冬の雪')),
    ('black_white_classic', jsonb_build_object('es', 'Blanco y negro clasico', 'fr', 'Noir et blanc classique', 'de', 'Klassisch Schwarz-Weiss', 'ja', 'クラシック白黒')),
    ('vintage_film', jsonb_build_object('es', 'Pelicula vintage', 'fr', 'Film vintage', 'de', 'Vintage Film', 'ja', 'ヴィンテージフィルム')),
    ('rembrandt_lighting', jsonb_build_object('es', 'Iluminacion Rembrandt', 'fr', 'Eclairage Rembrandt', 'de', 'Rembrandt-Licht', 'ja', 'レンブラント照明')),
    ('soft_glamour', jsonb_build_object('es', 'Glamour suave', 'fr', 'Glamour doux', 'de', 'Soft Glamour', 'ja', 'ソフトグラマー')),
    ('superhero_style', jsonb_build_object('es', 'Superheroe', 'fr', 'Super-heros', 'de', 'Superheld', 'ja', 'スーパーヒーロー')),
    ('royal_portrait', jsonb_build_object('es', 'Retrato real', 'fr', 'Portrait royal', 'de', 'Koenigliches Portrait', 'ja', 'ロイヤルポートレート')),
    ('astronaut_space', jsonb_build_object('es', 'Astronauta espacial', 'fr', 'Astronaute spatial', 'de', 'Astronaut im Weltraum', 'ja', '宇宙飛行士')),
    ('comic_book_style', jsonb_build_object('es', 'Estilo comic', 'fr', 'Style bande dessinee', 'de', 'Comicbuch-Stil', 'ja', 'コミックブック')),
    ('multiverse_adventure', jsonb_build_object('es', 'Aventura multiverso', 'fr', 'Aventure multivers', 'de', 'Multiversum-Abenteuer', 'ja', 'マルチバースアドベンチャー')),
    ('cosplay_hero', jsonb_build_object('es', 'Heroe cosplay', 'fr', 'Heros cosplay', 'de', 'Cosplay-Held', 'ja', 'コスプレヒーロー')),
    ('instagram_creator', jsonb_build_object('es', 'Creador de Instagram', 'fr', 'Createur Instagram', 'de', 'Instagram Creator', 'ja', 'Instagramクリエイター')),
    ('tiktok_trend', jsonb_build_object('es', 'Tendencia TikTok', 'fr', 'Tendance TikTok', 'de', 'TikTok Trend', 'ja', 'TikTokトレンド')),
    ('editorial_fashion', jsonb_build_object('es', 'Moda editorial', 'fr', 'Mode editoriale', 'de', 'Editorial Fashion', 'ja', 'エディトリアルファッション')),
    ('streetwear_drop', jsonb_build_object('es', 'Streetwear', 'fr', 'Streetwear', 'de', 'Streetwear Drop', 'ja', 'ストリートウェア')),
    ('neon_dreamscape', jsonb_build_object('es', 'Paisaje neon', 'fr', 'Reve neon', 'de', 'Neon Dreamscape', 'ja', 'ネオンドリーム')),
    ('luxury_boutique', jsonb_build_object('es', 'Boutique de lujo', 'fr', 'Boutique luxe', 'de', 'Luxusboutique', 'ja', 'ラグジュアリーブティック')),
    ('minimal_studio', jsonb_build_object('es', 'Estudio minimalista', 'fr', 'Studio minimaliste', 'de', 'Minimal Studio', 'ja', 'ミニマルスタジオ')),
    ('startup_founder', jsonb_build_object('es', 'Fundador startup', 'fr', 'Fondateur startup', 'de', 'Startup-Gruender', 'ja', 'スタートアップ創業者')),
    ('podcast_host', jsonb_build_object('es', 'Presentador podcast', 'fr', 'Animateur podcast', 'de', 'Podcast-Host', 'ja', 'ポッドキャスト司会者')),
    ('gamer_streamer', jsonb_build_object('es', 'Streamer gamer', 'fr', 'Streamer gaming', 'de', 'Gamer-Streamer', 'ja', 'ゲーム配信者')),
    ('travel_creator', jsonb_build_object('es', 'Creador de viajes', 'fr', 'Createur voyage', 'de', 'Travel Creator', 'ja', 'トラベルクリエイター')),
    ('fitness_brand', jsonb_build_object('es', 'Marca fitness', 'fr', 'Marque fitness', 'de', 'Fitness Brand', 'ja', 'フィットネスブランド')),
    ('beauty_influencer', jsonb_build_object('es', 'Influencer belleza', 'fr', 'Influenceur beaute', 'de', 'Beauty Influencer', 'ja', 'ビューティーインフルエンサー')),
    ('music_artist', jsonb_build_object('es', 'Artista musical', 'fr', 'Artiste musical', 'de', 'Musikartist', 'ja', '音楽アーティスト')),
    ('fashion_portrait', jsonb_build_object('es', 'Retrato de moda', 'fr', 'Portrait mode', 'de', 'Fashion Portrait', 'ja', 'ファッションポートレート')),
    ('creator_headshot', jsonb_build_object('es', 'Headshot creador', 'fr', 'Headshot createur', 'de', 'Creator Headshot', 'ja', 'クリエイターヘッドショット')),
    ('cinematic_portrait', jsonb_build_object('es', 'Retrato cinematografico', 'fr', 'Portrait cinematographique', 'de', 'Cinematic Portrait', 'ja', 'シネマティックポートレート')),
    ('oriental_classic', jsonb_build_object('es', 'Clasico oriental', 'fr', 'Classique oriental', 'de', 'Orientalischer Klassiker', 'ja', 'オリエンタルクラシック')),
    ('hanfu_elegance', jsonb_build_object('es', 'Elegancia hanfu', 'fr', 'Elegance hanfu', 'de', 'Hanfu Eleganz', 'ja', '漢服エレガンス')),
    ('ink_wash_art', jsonb_build_object('es', 'Tinta china', 'fr', 'Encre lavee', 'de', 'Tuschemalerei', 'ja', '水墨画')),
    ('guofeng_portrait', jsonb_build_object('es', 'Retrato guofeng', 'fr', 'Portrait guofeng', 'de', 'Guofeng Portrait', 'ja', '国風ポートレート')),
    ('imperial_portrait', jsonb_build_object('es', 'Retrato imperial', 'fr', 'Portrait imperial', 'de', 'Imperiales Portrait', 'ja', 'インペリアルポートレート')),
    ('clean_luxury_social', jsonb_build_object('es', 'Lujo limpio social', 'fr', 'Luxe social epure', 'de', 'Clean Luxury Social', 'ja', 'クリーンラグジュアリー'))
)
UPDATE headshot_styles AS style
SET
  localized_names = COALESCE(style.localized_names, '{}'::jsonb) || translations.localized_names,
  localized_category_labels = COALESCE(style.localized_category_labels, '{}'::jsonb) ||
    CASE style.category
      WHEN 'professional' THEN jsonb_build_object('es', 'Profesional', 'fr', 'Professionnel', 'de', 'Professionell', 'ja', 'プロ向け')
      WHEN 'artistic' THEN jsonb_build_object('es', 'Creativo', 'fr', 'Creatif', 'de', 'Kreativ', 'ja', 'クリエイティブ')
      WHEN 'lifestyle' THEN jsonb_build_object('es', 'Lifestyle', 'fr', 'Style de vie', 'de', 'Lifestyle', 'ja', 'ライフスタイル')
      WHEN 'seasonal' THEN jsonb_build_object('es', 'Temporada', 'fr', 'Saisonnier', 'de', 'Saisonal', 'ja', '季節')
      ELSE '{}'::jsonb
    END,
  updated_at = NOW()
FROM translations
WHERE style.id = translations.id;

COMMIT;
