import prisma from '../../db/index';
class TagRepository {
    findTagsById(ids: number[]) {
        return prisma.tag.findMany({ where: { id: { in: ids } } });
    }
}

const tagRepository = new TagRepository();

export default tagRepository;
