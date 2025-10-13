import { Prisma } from '../../../generated/prisma';
import prisma from '../../db/index';
class TagRepository {
    findUserTagBySlug(slug: string) {
        return prisma.tag.findFirst({ where: { slug: slug } });
    }

    findUserTagsById(userId: number, ids: number[]) {
        return prisma.tag.findMany({ where: { id: { in: ids }, userId } });
    }

    findUserTags(userId: number, query: Prisma.TagWhereInput) {
        return prisma.tag.findMany({ where: { ...query, userId } });
    }

    findUserTag(userId: number, tagId: number) {
        return prisma.tag.findMany({ where: { id: tagId, userId } });
    }

    createTag(data: Prisma.TagCreateInput) {
        return prisma.tag.create({ data });
    }

    updateUserTag(userId: number, tagId: number, data: Prisma.TagUpdateInput) {
        return prisma.expense.update({ where: { userId, id: tagId }, data });
    }

    deleteUserTag(userId: number, tagId: number) {
        return prisma.expense.delete({ where: { id: tagId, userId } });
    }
}

const tagRepository = new TagRepository();

export default tagRepository;
