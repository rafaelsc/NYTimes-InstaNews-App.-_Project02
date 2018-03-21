
$(function () {
    var articlesLoad = 12; // number of articles wanted

    //
    // select field change
    // 
    $('.category').change(function () {
        getArticles();
    });

    //
    // loading articles: function for getting parameters before calling Ajax 
    //
    function getArticles() {
        articlesLoad = 12;
        $(".articles").addClass("loader");
        $("header").addClass("header-small");
        $("footer").addClass("footer-small");
        $(".search-bar").css("display", "flex");
        $(".articles").empty();
        var section = $(".category").val();
        var search = $(".search").val();
        var apiKey = "3dd7029a92634d569b2c1a998f798274";
        var url = "https://api.nytimes.com/svc/topstories/v2/" + section + ".json?api-key=" + apiKey;
        callAjax(url, search);
    }

    //
    // Ajax call function
    //
    function callAjax(url, search) {
        $.ajax({
            method: "GET",
            url: url,
        }).done(function (data) {
            var articles = data.results;
            for (var i = 0; i < articles.length; i++) {
                // finding the best quality picture (if there is any)
                if (articles[i].multimedia.length === 5) {
                    var image = articles[i].multimedia[4].url;
                    if (image && (articlesLoad > 0)) {
                        var containsAbstract = isSubstring(articles[i].abstract, search);
                        var containsTitle = isSubstring(articles[i].title, search);
                        // filter articles
                        if (!search || containsAbstract || containsTitle) {
                            $(".articles").append("<a href='" + articles[i].url + "' class='article' style='background:url(" + image + ") no-repeat center/cover;'><li><p class='article-text'>" + articles[i].abstract + "</p></li></a>");
                            articlesLoad--;
                        }
                    }
                    if (articlesLoad === 0) {
                        break;
                    }
                }
            }
            // if no articles with search filter
            if (articlesLoad === 12) {
                $(".articles").html("<p class='no-article'>Sorry, no article found.</p>");
            }
            $(".articles").removeClass("loader");
        }).fail(function (error) {
            throw error;
        });
    }

    //
    // Selectric initialization
    //
    $('.category').selectric();

    //
    // touchscreen detection
    // @source https://codeburst.io/the-only-way-to-detect-touch-with-javascript-7791a3346685/ 03/12/2018
    //
    window.addEventListener('touchstart', function () {
        $(".article-text").css("opacity", "1");
    });

    //
    // search input function
    // @source https://stackoverflow.com/questions/8747439/detecting-value-change-of-inputtype-text-in-jquery 03/15/2018
    //
    var searchLength = $(".search").val().length;

    $(".search").on("keyup", function (event) {
        var key = event.keyCode;
        var newSearchLenght = $(this).val().length;
        // alphanumeric input or backspace/delete which deletes a character
        if ((key <= 90 && key >= 48) || (key === 8 && searchLength !== newSearchLenght) || (key === 46 && searchLength !== newSearchLenght)) {
            getArticles();
        }
        searchLength = newSearchLenght;
    });

    $(".search").on("change paste", function () {
        getArticles();
    });

    $(".search").keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });

    //
    // function for finding a substring (search input)
    // @source https://stackoverflow.com/questions/2854527/find-substring-with-jquery 03/15/2018
    //
    function isSubstring(haystack, needle) {
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    }
});