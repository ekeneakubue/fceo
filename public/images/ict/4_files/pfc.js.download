"use strict";

(function ($) {
  $(document).ready(function () {
    $('.pfc-posts-main .pfc-post.layout-one').each(function () {
      const thumbHeight = parseInt($(this).find('.news-thumb img').height());
      const infoHeight = parseInt($(this).find('.news-text-wrap').height());
      if (!isNaN(thumbHeight) && !isNaN(infoHeight) && thumbHeight > infoHeight) {
        $(this).find('.news-text-wrap').css('min-height', thumbHeight + 'px');
      }
    });
  });
})(jQuery);