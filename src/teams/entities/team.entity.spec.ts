import { Team } from './team.entity';

describe('Team Entity', () => {
  it('should be defined', () => {
    expect(new Team()).toBeDefined();
  });

  it('should have correct properties', () => {
    const team = new Team();
    expect(team.id).toBeUndefined();
    expect(team.name).toBeUndefined();
    expect(team.description).toBeUndefined();
    expect(team.createdAt).toBeUndefined();
    expect(team.updatedAt).toBeUndefined();
    expect(team.members).toBeUndefined();
  });
});