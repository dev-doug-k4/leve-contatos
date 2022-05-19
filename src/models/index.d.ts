import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type ContactMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Contact {
  readonly id: string;
  readonly name: string;
  readonly cover?: string | null;
  readonly phone?: string | null;
  readonly facebookLink?: string | null;
  readonly instagramLink?: string | null;
  readonly linkedinLink?: string | null;
  readonly twitterLink?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Contact, ContactMetaData>);
  static copyOf(source: Contact, mutator: (draft: MutableModel<Contact, ContactMetaData>) => MutableModel<Contact, ContactMetaData> | void): Contact;
}