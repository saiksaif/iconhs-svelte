<script>
    export let image, title, body, linkTo;
</script>

<article class="js-watch topic_row set-animation animate" style="line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    --swiper-theme-color: #007aff;
    --swiper-navigation-size: 44px;
    -webkit-box-direction: normal;
    box-sizing: inherit;
    display: flex;
    margin-bottom: 80px;">
        <figure class="topic_figure" style="    line-height: 1.15;
        -webkit-text-size-adjust: 100%;
        --swiper-theme-color: #007aff;
        --swiper-navigation-size: 44px;
        -webkit-box-direction: normal;
        box-sizing: inherit;
        margin: 0;
        width: 290px;
        transition: opacity .5s .15s;
        opacity: 1;">
            <img class="topic_image" src={image} alt="" style="    line-height: 1.15;
            -webkit-text-size-adjust: 100%;
            --swiper-theme-color: #007aff;
            --swiper-navigation-size: 44px;
            -webkit-box-direction: normal;
            box-sizing: inherit;
            border-style: none;
            vertical-align: middle;
            width: 100%;
            display: block;">
        </figure>
        <div class="topic_body" style="    line-height: 1.15;
        -webkit-text-size-adjust: 100%;
        --swiper-theme-color: #007aff;
        --swiper-navigation-size: 44px;
        -webkit-box-direction: normal;
        box-sizing: inherit;
        position: relative;
        background: #fff;
        margin: 40px 0 0 -40px;
        width: calc(100% - 290px + 40px);
        padding: 20px 25px 0;
        transition: opacity .5s .25s;
        opacity: 1;">
            <header class="topic_header" style="    line-height: 1.15;
            -webkit-text-size-adjust: 100%;
            --swiper-theme-color: #007aff;
            --swiper-navigation-size: 44px;
            -webkit-box-direction: normal;
            box-sizing: inherit;">
                <h3 class="topic_title" style="    -webkit-text-size-adjust: 100%;
                --swiper-theme-color: #007aff;
                --swiper-navigation-size: 44px;
                -webkit-box-direction: normal;
                box-sizing: inherit;
                font-weight: 500;
                color: #132d76;
                margin: 0 0 3px;
                font-size: 2rem;
                line-height: 1.40625;
                margin-bottom: 5px;">
                    <a style="    -webkit-text-size-adjust: 100%;
                    --swiper-theme-color: #007aff;
                    --swiper-navigation-size: 44px;
                    -webkit-box-direction: normal;
                    font-weight: 500;
                    font-size: 2rem;
                    line-height: 1.40625;
                    box-sizing: inherit;
                    background-color: transparent;
                    text-decoration: none;
                    color: inherit;
                    transition: color .25s;" class="topic_title_link" href="/">
                    {title}																		</a>
                </h3>
            </header>
            <div class="topic_caption" style="    line-height: 1.15;
            -webkit-text-size-adjust: 100%;
            --swiper-theme-color: #007aff;
            --swiper-navigation-size: 44px;
            -webkit-box-direction: normal;
            box-sizing: inherit;
            margin-top: 5px;">
                <p></p><p style="    -webkit-text-size-adjust: 100%;
                --swiper-theme-color: #007aff;
                --swiper-navigation-size: 44px;
                -webkit-box-direction: normal;
                font-weight: 400;
                color: #37424A;
                font-size: 1.0625rem;
                line-height: 1.94118;
                box-sizing: inherit;
                margin: 0;">{body}</p><p></p>
            </div>
            <!-- <footer class="topic_link_wrapper" style="    line-height: 1.15;
            -webkit-text-size-adjust: 100%;
            --swiper-theme-color: #007aff;
            --swiper-navigation-size: 44px;
            -webkit-box-direction: normal;
            box-sizing: inherit;
            margin-top: 5px;">
                <a style="    -webkit-text-size-adjust: 100%;
                --swiper-theme-color: #007aff;
                --swiper-navigation-size: 44px;
                -webkit-box-direction: normal;
                box-sizing: inherit;
                background-color: transparent;
                text-decoration: none;
                color: #37424A;
                display: inline-block;
                transition: color .25s;
                padding: 10px 0;
                font-size: 1.0625rem;
                line-height: 1.94118;
                font-weight: 500;" class="topic_link theme_" href="/">
                    <span class="topic_link_label">Learn More</span>
                </a>
            </footer> -->
        </div>
    </article>

<style>

</style>