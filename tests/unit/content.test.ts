import { describe, it, expect } from 'vitest';
import { profile } from '@/content/profile';
import { roles, amazonReturnCount } from '@/content/experience';
import { sproutfund } from '@/content/project';
import { skills } from '@/content/skills';
import { schools, awards } from '@/content/education';

describe('content integrity', () => {
  it('excludes non-CS retail employers', () => {
    const orgs = roles.map((r) => r.org.toLowerCase()).join(' ');
    expect(orgs).not.toContain('meta');
    expect(orgs).not.toContain('best buy');
  });

  it('counts three Amazon internships', () => {
    expect(amazonReturnCount).toBe(3);
    expect(roles.filter((r) => r.isAmazon)).toHaveLength(3);
  });

  it('has exactly one current role, at Amazon', () => {
    const current = roles.filter((r) => r.end === null);
    expect(current).toHaveLength(1);
    expect(current[0].isAmazon).toBe(true);
    expect(current[0].title).toContain('SDE Intern');
  });

  it('places AWS in San Jose, per the adjudicated fact', () => {
    const aws = roles.find((r) => r.org === 'AWS');
    expect(aws?.city.name).toBe('San Jose');
    expect(aws?.city.state).toBe('CA');
  });

  it('ends the 2025 Amazon internship in August, per the adjudicated fact', () => {
    const r = roles.find((r) => r.id === 'amazon-2025');
    expect(r?.end).toBe('August 2025');
  });

  it('states INIT membership as over 100, per the adjudicated fact', () => {
    const init = roles.find((r) => r.id === 'init-president');
    expect(init?.bullets.join(' ')).toContain('100');
    expect(init?.bullets.join(' ')).not.toContain('45');
  });

  it('never claims SproutFund was solo work', () => {
    expect(sproutfund.credit).toContain('4-person');
    expect(sproutfund.credit.toLowerCase()).not.toContain('solo');
  });

  it('lists skills from real work, not LinkedIn endorsements', () => {
    const labels = skills.map((s) => s.label);
    expect(labels).toContain('Java');
    expect(labels).toContain('React');
    expect(labels).toContain('DynamoDB');
    expect(labels).not.toContain('Advertising');
    expect(labels).not.toContain('Financial Analysis');
  });

  it('orders roles newest first', () => {
    expect(roles[0].id).toBe('amazon-2026');
  });

  it('links a résumé, GitHub, and email', () => {
    expect(profile.resume).toBe('/resume.pdf');
    expect(profile.github).toContain('github.com/valeriachaconlanz');
    expect(profile.email).toBe('valeriaachlz04@gmail.com');
  });

  it('graduates FIU in May 2027', () => {
    const fiu = schools.find((s) => s.name.includes('Florida International'));
    expect(fiu?.end).toBe('May 2027');
  });

  it('records the Amazon Future Engineer scholarship amount', () => {
    expect(awards.map((a) => a.detail).join(' ')).toContain('$40,000');
  });
});
