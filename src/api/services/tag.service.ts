import { Prisma } from '../../../generated/prisma';
import tagRepository from '../repositories/tag.repository';
class TagService {
    getUserTagBySlug(slug: string) {}

    createUserTag(userId: number, data: Prisma.TagCreateInput) {
        return tagRepository.createTag({ ...data, user: { connect: { id: userId } } });
    }
}

const expenseService = new TagService();

export default expenseService;
