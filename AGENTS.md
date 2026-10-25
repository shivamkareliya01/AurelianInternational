<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Project rules

- **HARD RULE**: NEVER run `git commit` or `git push` without explicit permission from the user. Always show the proposed changes, summary, and ask for user approval before staging, committing, or pushing anything to git.
- Editable content (company info, products, blog, FAQ, certifications, markets) lives in `src/data/*.ts`; pages read from there so non-devs can edit one place.
- Shared site chrome (Navbar, Footer, floating actions, enquiry basket provider) is mounted in `src/routes/__root.tsx`.
- Button styles are the `btn` class map in `src/components/site/primitives.tsx`; colors come only from tokens in `src/styles.css`.
