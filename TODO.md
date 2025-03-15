ARTICLE VIEW/MODEL:

add a quote to the article model which we can render differently.

see mobile view: the quote can float into view as we parallax scroll past it with image in background

SERVER:

- add 'size' property to all artworks. this is useful for pagination artworik display, so that the size of pagination items somewhat corresponds to the artworks actual size. pixel height and width isn't relevant

DATA-FETCHING / ROUTES:

- add some safety checks or mechanisms that prevent users from using query params to fetch data that they shouldn't have access to.

STATUS CODES:

- add them to the api responses.

---

DELETE ARTWORK / BLOG ENTRY / ARTICLE

<!-- * different outcomes required for each -->

ARTWORK:

- the cloudinary image should be deleted

ARTICLE:

- the cloudinary image should NOT be deleted

DELETE BLOG ENTRY

<!-- ! factors to consider ! -->

- the cloudinary image SOMETIMES should be deleted
(the artwork image might be used elsewhere OR we might have added the image just for the blog entry)
<!-- ? solution ? : use objectIds of artwork instead of url. this might require that artwork has a kv pair of isArtwork, to differentiate between assets that feature on app but not in collections/artwork searches -->

FRONTEND TYPES:

- should i Omit from the DBdocument type to create the frontend types?

```
src/
└── components/
    ├── animations/
    │   ├── ArtworkImage.tsx                    [MOVE from animations/]
    │   ├── PageLoading.tsx                     [MOVE from animations/]
    │   └── TransitionGroup.tsx                 [MOVE from animations/]
    │
    ├── common/                                 [NEW - from generic/]
    │   └── Feed.tsx                           [MOVE from generic/]
    │
    ├── features/
    │   ├── admin/
    │   │   ├── feeds/                         [MOVE from admin/feeds/]
    │   │   │   ├── ArticleFeed.tsx
    │   │   │   ├── ArtworkFeed.tsx
    │   │   │   ├── BlogFeed.tsx
    │   │   │   └── CollectionFeed.tsx
    │   │   └── forms/                         [MOVE from ui/forms/admin/]
    │   │       ├── CreateArticle.tsx
    │   │       ├── CreateArticleForm.tsx
    │   │       ├── CreateArtworkForm.tsx
    │   │       └── ... (all admin forms)
    │   │
    │   └── home/                              [MOVE from views/home/]
    │       ├── Home.test.tsx
    │       └── Home.tsx
    │
    ├── layouts/
    │   ├── admin/                             [MOVE from layouts/]
    │   │   ├── AdminContentLayout.tsx
    │   │   ├── AdminPageContainer.tsx
    │   │   └── AdminSidebar.tsx
    │   └── public/                            [MOVE from layouts/]
    │       ├── ArtworkViewLayout.tsx
    │       ├── BlogSortedByLayout.tsx
    │       ├── ContentLayout.tsx
    │       └── PaginationLayout.tsx
    │
    ├── loaders/                               [Keep structure, just move]
    │   ├── ArticleLoader.tsx
    │   ├── BiographySubnavLoader.tsx
    │   └── ... (all loaders)
    │
    ├── sections/                              [MOVE from contentSections/]
    │   ├── HomeArtworkSection.tsx
    │   ├── HomeBiographySection.tsx
    │   ├── HomeBlogSection.tsx
    │   ├── HomeCollectionSection.tsx
    │   ├── HomeProjectSection.tsx
    │   └── HomeSubscribeSection.tsx
    │
    ├── skeletons/                            [Keep structure, just move]
    │   ├── ArticleViewSkeleton.tsx
    │   ├── ArtworkInfoCardSkeleton.tsx
    │   └── ... (all skeletons)
    │
    └── ui/
        ├── navigation/
        │   ├── header/
        │   │   └── Header.tsx                [MOVE from ui/header/header.tsx]
        │   ├── navBar/                       [MOVE from ui/navBar/]
        │   │   ├── DesktopNavLayout.tsx
        │   │   ├── MobileNavLayout.tsx
        │   │   └── TabletNavLayout.tsx
        │   ├── breadcrumbs/                  [MOVE from ui/breadcrumbs/]
        │   │   └── Breadcrumbs.tsx
        │   └── subnav/                       [MOVE from ui/subnav/]
        │       ├── SubNavBar.tsx
        │       └── Subnav.tsx
        │
        ├── forms/                            [MOVE from ui/forms/]
        │   ├── ContactForm.tsx
        │   ├── EnquiryForm.tsx
        │   ├── LoginForm.tsx
        │   ├── LogoutForm.tsx
        │   ├── SignInForm.tsx
        │   ├── SignUpForm.tsx
        │   ├── SubscribeForm.tsx
        │   └── user/                         [MOVE from ui/forms/user/]
        │
        ├── cards/                            [MOVE from ui/cards/]
        │   ├── ArticleFeedCard.tsx
        │   ├── ArtworkFeedCard.tsx
        │   └── ... (all cards)
        │
        ├── icons/                            [MOVE from ui/common/icons/]
        │   ├── BlogIcon.tsx
        │   ├── CollectionIcon.tsx
        │   └── ... (all icons)
        │
        ├── modals/                           [MOVE from ui/modal/]
        │   └── Modal.tsx
        │
        ├── hero/                             [MOVE from ui/hero/]
        │   ├── Hero.tsx
        │   ├── HeroSkeleton.tsx
        │   ├── HeroSlide.tsx
        │   └── slides/
        │       └── Slide1.tsx
        │
        ├── utilities/                        [NEW - move from ui/ root]
        │   ├── button.tsx
        │   ├── calendar.tsx
        │   ├── popover.tsx
        │   └── tooltip.tsx
        │
        ├── shadcn/                           [MOVE from ui/shadcn/]
        │   ├── DatePicker.tsx
        │   ├── breadcrumb.tsx
        │   └── ... (all shadcn components)
        │
        └── views/                            [MOVE from views/]
            ├── AdminDashboard.tsx
            ├── ArticleView.tsx
            ├── ArtworkView.tsx
            └── ... (all views)
```

User nav data:

options 1:

a fetch for each subnav item

options 2:

a single fetch that returns all the data
