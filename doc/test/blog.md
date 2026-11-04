# Blog API — Reference

> Base URL: `http://localhost:5000/api/v1/blogs`
> Admin routes require `Authorization: Bearer <token>`.

---

## Public Endpoints

### List blogs

```
GET /api/v1/blogs
```

Query params (all optional):

| Param        | Example     | Notes                                     |
| ------------ | ----------- | ----------------------------------------- |
| `status`     | `PUBLISHED` | Admin only — public always sees PUBLISHED |
| `isFeatured` | `true`      |                                           |
| `isPinned`   | `true`      |                                           |
| `tagId`      | `uuid`      |                                           |
| `tagSlug`    | `nextjs`    |                                           |
| `search`     | `react`     | Matches title + excerpt                   |
| `page`       | `1`         | Default 1                                 |
| `limit`      | `10`        | Default 10, max 100                       |

Response includes `data[]` and `meta { total, page, limit, totalPages }`.

### Get blog by slug

```
GET /api/v1/blogs/slug/:slug
```

Increments `viewCount`. Drafts return 404 unless the caller is an admin.

### Related blogs

```
GET /api/v1/blogs/slug/:slug/related?limit=3
```

### Get blog by id

```
GET /api/v1/blogs/:id
```

### Tags

```
GET /api/v1/blogs/tags
```

### Comments (approved only)

```
GET /api/v1/blogs/:id/comments
```

Returns top-level comments with nested `replies[]`.

### Like a blog

```
POST /api/v1/blogs/:id/like
```

IP-deduped for 24 hours. Response:

```json
{
  "liked": true,
  "alreadyLiked": false,
  "likeCount": 12,
  "message": "Thanks for the like!"
}
```

### Submit a comment

```
POST /api/v1/blogs/:id/comments
Content-Type: application/json

{
  "name": "Rahim",
  "email": "rahim@example.com",
  "comment": "Great post!",
  "parentId": "optional-uuid"
}
```

Comments are created with `isApproved: false` and appear only after admin approval.
Replies are limited to one level of nesting.

---

## Admin Endpoints

### Create blog

```
POST /api/v1/blogs
Content-Type: multipart/form-data
```

| Field             | Type | Notes                                |
| ----------------- | ---- | ------------------------------------ |
| `title`           | text | **required**                         |
| `slug`            | text | auto-generated from title if omitted |
| `excerpt`         | text |                                      |
| `content`         | text | **required** — sanitized HTML        |
| `status`          | text | `DRAFT` \| `PUBLISHED` \| `ARCHIVED` |
| `isFeatured`      | text | `true` / `false`                     |
| `isPinned`        | text | `true` / `false`                     |
| `coverImageAlt`   | text |                                      |
| `metaTitle`       | text |                                      |
| `metaDescription` | text |                                      |
| `canonicalUrl`    | text |                                      |
| `tagIds`          | text | JSON array: `["uuid1","uuid2"]`      |
| `thumbnail`       | file | image                                |
| `ogImage`         | file | image                                |

`readingTime` is computed automatically from the content (200 wpm).
`publishedAt` is set automatically on first publish.

### Update blog

```
PUT /api/v1/blogs/:id
```

Same fields as create, all optional. Sending `tagIds` replaces the whole tag set.

### Delete blog

```
DELETE /api/v1/blogs/:id
```

Also deletes the thumbnail/ogImage from Cloudinary and cascades comments.

### Tags

```
POST   /api/v1/blogs/tags        { "name": "Next.js" }
DELETE /api/v1/blogs/tags/:id
```

### Comment moderation

```
GET   /api/v1/blogs/comments?isApproved=false&page=1&limit=20
PATCH /api/v1/blogs/comments/:id/approve   { "isApproved": true }
DELETE /api/v1/blogs/comments/:id
```

---

## Notes

- **Content format:** sanitized HTML (Tiptap output). Sanitized with
  `sanitizeRichContent()` on save.
- **Slug collisions:** automatically suffixed `-2`, `-3`, …
- **Public visibility:** only `PUBLISHED` posts are returned to anonymous callers.
- **Sitemap:** published blogs are included automatically at `/sitemap.xml`.
