import { hashSync } from 'bcrypt';
import { program } from 'commander';
import { UserRole, UserStatus } from './common/enums';
import { dataSource } from './data-source';
import { User } from './entities';

program.command('seed').action(async () => {
  await dataSource.initialize();
  await dataSource.transaction(async (manager) => {
    await manager.getRepository(User).save({
      id: '1',
      username: 'superadmin',
      hashedPassword: hashSync('123456', 10),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
  });
  process.exit();
});

program.parse();
