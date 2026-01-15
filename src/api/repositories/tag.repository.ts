import { Prisma } from '../../../generated/prisma';
import prisma from '../../db/index';
class TagRepository {
    findUserTagBySlug(userId: number, slug: string) {
        return prisma.tag.findFirst({ where: { slug: slug, userId } });
    }

    countTags(query: Prisma.TagCountArgs) {
        return prisma.tag.count(query);
    }

    findUserTagsById(userId: number, ids: number[]) {
        return this.findAllTags({ where: { id: { in: ids }, userId } });
    }

    findUserTags(userId: number, query: Prisma.TagWhereInput) {
        return this.findAllTags({ where: { ...query, userId } });
    }

    findUserTag(userId: number, tagId: number) {
        return prisma.tag.findFirst({ where: { id: tagId, userId }, include: { children: true } });
    }

    findAllTags(query: Prisma.TagFindManyArgs) {
        return prisma.tag.findMany(query);
    }

    createTag(data: Prisma.TagCreateInput) {
        return prisma.tag.create({ data });
    }

    updateUserTag(userId: number, tagId: number, data: Prisma.TagUpdateInput) {
        return this.updateTag({ where: { userId, id: tagId }, data });
    }

    updateTag(query: Prisma.TagUpdateArgs) {
        return prisma.tag.update(query);
    }

    deleteUserTag(userId: number, tagId: number) {
        return this.deleteTag({ where: { id: tagId, userId } });
    }

    deleteTag(query: Prisma.TagDeleteArgs) {
        return prisma.tag.delete(query);
    }
}

const tagRepository = new TagRepository();

export default tagRepository;
