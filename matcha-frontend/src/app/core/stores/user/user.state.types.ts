export interface BaseUser {
  userUUID: string;
  displayName: string;
  firstName: string;
  lastName?: string;
  lastAlive: number;
  age: number;
  avatar?: string;
  /**
   * @param single looking for someone
   * @param couple can no longer be found when exploring
   * @param free couple but looking for someone
   */
  status: 'single' | 'couple' | 'free';
  gender: 'male' | 'female';
  city: string;
  rating?: number;
  pictures: string[];
  interests: string[];
  biography: string;
  sexuality: 'heterosexual' | 'homosexual' | 'bisexual';
  role: 'user' | 'administrator';
}

export interface FullUser extends BaseUser {
  emailAddress?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface PublicUser extends BaseUser {
  distance: number;
}
