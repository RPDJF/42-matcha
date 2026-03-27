export interface BaseUser {
  userUUID: string;
  displayName: string;
  age: number;
  lastAlive: number;
  isAdmin: boolean;
  avatar?: string;
  /**
   * @param single looking for someone
   * @param couple can no longer be found when exploring
   * @param free couple but looking for someone
   */
  status: 'single' | 'couple' | 'free';
  gender: 'male' | 'female';
  sexuality: 'heterosexual' | 'homosexual' | 'bisexual';
  biography: string;
  interests: string[];
  pictures: string[];
  rating: number;
  city: string;
}

export interface FullUser extends BaseUser {
  emailAddress?: string;
  location: string;
}

export interface PublicUser extends BaseUser {
  distance: number;
}
