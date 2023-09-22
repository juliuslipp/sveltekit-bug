import { error } from "@sveltejs/kit";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const modules = import.meta.glob(`../../content/*.md`);

export const prerender = true;

const mappedModules = Promise.all(
    Object.entries(modules).map(
        async ([path, importModule]) => {
            const module = await importModule();
            return {
                slug: path.split("/").pop().split(".").shift(),
                text: String(path)
            };
        }
    )
);
export async function load(event) {
    const module = (await mappedModules).find(
        (module) => module.slug === event.params.slug
    );
    console.log(mappedModules);

    if (!module) {
        throw error(404);
    }

    return module;
}
