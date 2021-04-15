---
layout: base
---
# minimal [CMS](/admin/) documentation

## Set a unique ID, only at creation
![id field](id-field.png)

Pages that can be created from the CMS have an ID field which allows them to be referenced from other pages. That's how the home page can display a list of blog posts.

When you create an id, make sure that it is unique. If two blog posts have the same id, a page that wants to reference one of them will have to display both.

Never change the ID field, because the references to it from other pages would not be updated.

## The ID determines the url

The value of the ID field at creation is used to create the url where the page will be found. After creation, the url will not change. If you want another url, you need to create another page and delete the first one.

## Workflow
![image](https://user-images.githubusercontent.com/81250365/114866871-62cb3e00-9df4-11eb-97ee-2d06ba9f9f10.png)

### Workflow HestiaLabs

1. The creator of a content enters it and edits it (text, title, subtitles, images, photo/image credits) remains in "Draft" status until it is "publishable" according to him/her (do a preview to check).

  - -> Save + Set status "in review" + tell Charles

![image](https://user-images.githubusercontent.com/81250365/114867472-264c1200-9df5-11eb-88f3-552608c4aa84.png)

2. Charles retrieves the "in review" content and
  - a. Asks its creator for modifications
    - -> Save + Set status " draft " + inform creator -> return to point 1

  or 
  - b. Validates it
    - -> Save + Set status " ready " + inform PO

3. PO retrieves the "ready" content and
  - a. Requests changes from Charles
    - -> Save + Set status " in review " + inform Charles -> return to point 2

  or 
  - b. Validates it
    - -> Save + Publish

### Workflow Projects

1. The creator of a content enters it and edits it (text, title, subtitles, images, photo/image credits) remains in "Draft" status until it is "publishable" according to him/her (do a preview to check).

  - -> Save + Set status "in review" + tell Charles

![image](https://user-images.githubusercontent.com/81250365/114867472-264c1200-9df5-11eb-88f3-552608c4aa84.png)

2. Charles retrieves the "in review" content and
  - a. Asks its creator for modifications
    - -> Save + Set status " draft " + inform creator -> return to point 1

or 
  - b. Validates it
    - -> Save + Set status " ready " + inform Project Leader

3. Project leader retrieves the "ready" content and
  - a. Requests changes from the creator
    - -> Save + Set status " draft " + inform creator -> return to point 1
or 
  - b. Validates it
    - -> Save + Publish
