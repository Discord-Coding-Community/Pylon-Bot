const defaultNamespace: string = 'database';
const maxByteSize: number = 8196;

export const Default_KV: pylon.KVNamespace = new pylon.KVNamespace(
  defaultNamespace
);

type worked = boolean;
type error = boolean;
type key = string | number;

export async function ConvertOldDBToNewDB(namespace?: string): Promise<worked> {
  const rawData: object = await getRawData(namespace);

  return true;
}

export async function ConvertDBToNativeKV(namespace?: string): Promise<worked> {
  const rawData: object = await getRawData(namespace);

  try {
    if ((await clear(namespace)) === false) return false;

    for await (const [key, value] of rawData as any) {
      await (await getKV(namespace)).put(key, value);
    }
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
}

export async function save(
  key: key,
  value: pylon.Json,
  namespace?: string,
  overwriteIfExist: boolean = true
): Promise<worked> {
  if (
    value === undefined ||
    (await getSize(value)) > maxByteSize ||
    key === null ||
    key === undefined ||
    key === 'databaseKeySize' ||
    (typeof key === 'string' && key.startsWith('database_'))
  )
    return false;

  key = key.toString();

  const KV: pylon.KVNamespace = await getKV(namespace);
  let size: number = await getDBKeySize(KV.namespace);
  let savedData: pylon.JsonObject;

  try {
    for (let i: number = 0; i <= size; ++i) {
      savedData = await getInternalObject(i, KV.namespace);

      const cvalue: pylon.Json | undefined = savedData[key];

      if (cvalue !== undefined) {
        if (overwriteIfExist === false) return false;

        savedData[key] = value;

        if ((await saveInternalObject(savedData, i, KV.namespace)) === false) {
          delete savedData[key];
          await saveInternalObject(savedData, i, KV.namespace);
          await save(key, cvalue, KV.namespace);
        } else return true;
      }
    }

    for (let i: number = 0; i <= size; ++i) {
      savedData = await getInternalObject(i, KV.namespace);

      savedData[key] = value;

      if ((await saveInternalObject(savedData, i, KV.namespace)) === true)
        return true;
    }

    ++size;
    if (
      (await saveInternalObject({ [key]: value }, size, KV.namespace)) === true
    ) {
      await KV.put(`databaseKeySize`, size);
      return true;
    } else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function transact(
  key: key,
  edit: (value: pylon.Json | undefined) => pylon.Json,
  namespace?: string,
  replaceUndefined?: boolean
): Promise<worked>;

export async function transact(
  key: key[],
  edit: (value: pylon.Json | undefined) => pylon.Json,
  namespace?: string,
  replaceUndefined?: boolean
): Promise<worked[]>;

export async function transact(
  key: key | key[],
  edit: (value: pylon.Json | undefined) => pylon.Json,
  namespace?: string,
  replaceUndefined: boolean = false
): Promise<worked | worked[]> {
  if (Array.isArray(key)) {
    let workedForAll: worked[] = [];
    for await (const k of key)
      workedForAll.push(await transact(k, edit, namespace, replaceUndefined));
    return workedForAll;
  }

  key = key.toString();

  const KV: pylon.KVNamespace = await getKV(namespace);

  const oldValue: pylon.Json | undefined = await get(key, KV.namespace);

  if (oldValue === undefined && replaceUndefined === false) return false;

  let newValue: pylon.Json = await edit(oldValue);

  if (newValue === undefined) return false;

  if ((await getSize(newValue)) <= maxByteSize)
    return await save(key, newValue, KV.namespace);
  else return false;
}

export async function duplicate(
  oldKey: key,
  newKey: key,
  namespace?: string,
  overwriteIfNewKeyExist: boolean = false,
  edit?: (value: any) => pylon.Json
): Promise<worked> {
  let value: pylon.Json | undefined = await get(oldKey, namespace);
  if (edit !== undefined) value = await edit(value);
  return await save(newKey, value!, namespace, overwriteIfNewKeyExist);
}

export async function changeKey(
  oldKey: key,
  newKey: key,
  namespace?: string,
  overwriteIfNewKeyExist: boolean = false,
  edit?: (value: any) => pylon.Json
): Promise<worked> {
  let value: pylon.Json | undefined = await get(oldKey, namespace);
  if (edit !== undefined) value = await edit(value);

  if ((await save(newKey, value!, namespace, overwriteIfNewKeyExist)) === false)
    return false;
  return await del(oldKey, namespace);
}

export async function del(key: key, namespace?: string): Promise<worked>;

export async function del(key: key[], namespace?: string): Promise<worked[]>;

export async function del(
  key: key | key[],
  namespace?: string
): Promise<worked | worked[]> {
  if (Array.isArray(key)) {
    let workedForAll: worked[] = [];
    for await (const k of key) workedForAll.push(await del(k, namespace));
    return workedForAll;
  }

  key = key.toString();

  const KV: pylon.KVNamespace = await getKV(namespace);
  const size: number = await getDBKeySize(KV.namespace);

  for (let i: number = 0; i <= size; ++i) {
    let savedData: pylon.JsonObject = await getInternalObject(i, namespace);

    if (savedData[key] !== undefined) {
      delete savedData[key];

      await saveInternalObject(savedData, i, KV.namespace);

      if (Object.keys(savedData).length === 0) await dbKeyOrder(KV.namespace);

      return true;
    }
  }

  return false;
}

export async function exist(key: key, namespace?: string): Promise<boolean>;

export async function exist(key: key[], namespace?: string): Promise<boolean[]>;

export async function exist(
  key: key | key[],
  namespace?: string
): Promise<boolean | boolean[]> {
  if (Array.isArray(key)) {
    let exists: boolean[] = [];
    for await (const k of key)
      exists.push((await get(k, namespace)) !== undefined);
    return exists;
  }

  return (await get(key, namespace)) !== undefined;
}

export async function get<T extends pylon.Json>(
  key: key,
  namespace?: string
): Promise<T | undefined>;

export async function get<T extends pylon.Json>(
  key: key[],
  namespace?: string
): Promise<T[] | undefined>;

export async function get<T extends pylon.Json>(
  key: key | key[],
  namespace?: string
): Promise<T | T[] | undefined> {
  if (Array.isArray(key)) {
    let values: (pylon.Json | undefined)[] = [];
    for await (const k of key) values.push(await get(k, namespace));
    return values as any;
  }

  key = key.toString();

  const KV: pylon.KVNamespace = await getKV(namespace);
  const size: number = await getDBKeySize(KV.namespace);

  for (let i: number = 0; i <= size; ++i) {
    const savedData: pylon.JsonObject = await getInternalObject(i, namespace);
    if (savedData[key] !== undefined) return (savedData as any)[key];
  }

  return undefined;
}

export async function getAllValues<T extends pylon.Json>(
  namespace?: string,
  filter?: (value: any) => boolean
): Promise<T[]> {
  let rawData: object = await getRawData(namespace);
  if (filter !== undefined)
    return Object.values(await filterObjValues(rawData, filter)) as any;
  else return Object.values(rawData) as any;
}

export async function getAllKeys(
  namespace?: string,
  filter?: (value: any) => boolean
): Promise<string[]> {
  let rawData: object = await getRawData(namespace);
  if (filter !== undefined)
    return Object.keys(await filterObjValues(rawData, filter));
  else return Object.keys(rawData);
}

export async function getEntries(
  namespace?: string
): Promise<[string, pylon.Json][]> {
  return Object.entries(await getRawData(namespace));
}

export async function getRawData(namespace?: string): Promise<object> {
  const KV: pylon.KVNamespace = await getKV(namespace);
  const size: number = await getDBKeySize(KV.namespace);

  let data: pylon.JsonObject[] = [];
  for (let i: number = 0; i <= size; ++i)
    data = data.concat(await getInternalObject(i, namespace));

  return await objArrToObj(data);
}

export async function count(
  namespace?: string,
  filter?: (value: any) => boolean
): Promise<number> {
  return (await getAllKeys(namespace, filter)).length;
}

export async function clear(namespace?: string): Promise<worked> {
  await (await getKV(namespace)).clear();
  return true;
}

export async function namespaceToOtherNamespace(
  oldNamespace: string,
  newNamespace: string
): Promise<worked> {
  const oldKV: pylon.KVNamespace = await getKV(oldNamespace);
  const newKV: pylon.KVNamespace = await getKV(newNamespace);
  const oldSize: number = await getDBKeySize(oldKV.namespace);

  if (
    (await oldKV.list()).length === 0 ||
    (await newKV.list()).length !== 0 ||
    (await errorChecking(oldKV.namespace)) === true
  )
    return false;

  let worked: worked[] = [];
  for (let i: number = 0; i <= oldSize; ++i)
    if (
      (await saveInternalObject(
        await getInternalObject(i, oldKV.namespace),
        i,
        newKV.namespace
      )) === true
    ) {
      worked.push(true);
      await delInternalObject(i, oldKV.namespace);
    } else worked.push(false);

  if (oldSize !== 0) await newKV.put('databaseKeySize', oldSize);

  try {
    await oldKV.delete('databaseKeySize');
  } catch (_) {}

  return !worked.includes(false);
}

export async function errorChecking(namespace?: string): Promise<error> {
  const KV: pylon.KVNamespace = await getKV(namespace);
  const size: number = await getDBKeySize(KV.namespace);

  if (Object.keys(await getInternalObject(size + 1, KV.namespace)).length !== 0)
    return true;

  for (let i: number = 0; i <= size; ++i)
    if (
      (await getInternalObject(i, KV.namespace)) === undefined &&
      (i !== 0 || size !== 0)
    )
      return true;

  for await (const key of await KV.list())
    if (!key.startsWith('database_') && key !== 'databaseKeySize') return true;

  return false;
}

async function getKV(namespace?: string): Promise<pylon.KVNamespace> {
  if (namespace !== undefined && namespace !== null)
    return new pylon.KVNamespace(namespace);
  else return Default_KV;
}

async function getDBKeySize(namespace: string): Promise<number> {
  return (await (await getKV(namespace)).get<number>(`databaseKeySize`)) ?? 0;
}

async function getInternalObject(
  index: number,
  namespace?: string
): Promise<pylon.JsonObject> {
  const KV: pylon.KVNamespace = await getKV(namespace);
  return (await KV.get(`database_${index}`)) ?? {};
}

async function saveInternalObject(
  value: pylon.Json,
  index: number,
  namespace?: string
): Promise<boolean> {
  const KV: pylon.KVNamespace = await getKV(namespace);

  if ((await getSize(value)) <= maxByteSize) {
    await KV.put(`database_${index}`, value);
    return true;
  } else return false;
}

async function delInternalObject(
  index: key,
  namespace?: string
): Promise<boolean> {
  const KV: pylon.KVNamespace = await getKV(namespace);
  try {
    await KV.delete(`database_${index}`);
    return true;
  } catch (_) {
    return false;
  }
}

async function dbKeyOrder(namespace: string): Promise<boolean> {
  const KV: pylon.KVNamespace = await getKV(namespace);
  let size: number =
    (await getDBKeySize(namespace)) === 0 ? -1 : await getDBKeySize(namespace);

  for (let i: number = 0; i <= size; ++i) {
    const data: pylon.JsonObject | undefined = await getInternalObject(
      i,
      namespace
    );

    if (data === undefined || Object.keys(data).length === 0) {
      for (let y: number = i; y < size; ++y)
        await KV.put(
          `database_${y}`,
          (await KV.get(`database_${y + 1}`)) ?? {}
        );

      try {
        await KV.delete(`database_${size}`);
      } catch (_) {}

      --size;

      if (size === 0 || size === -1)
        try {
          await KV.delete(`databaseKeySize`);
        } catch (_) {}
      else await KV.put(`databaseKeySize`, size);

      await dbKeyOrder(KV.namespace);

      return true;
    }
  }

  return false;
}

async function getSize(data: any): Promise<number> {
  return new TextEncoder().encode(JSON.stringify(data)).length;
}

async function objArrToObj(objectArray: object[]): Promise<object> {
  let nObject: { [key: string]: any } = {};

  for await (const obj of objectArray)
    for await (const [key, value] of Object.entries(obj)) nObject[key] = value;

  return nObject;
}

async function filterObjValues(
  obj: object,
  filter: (value: any) => boolean
): Promise<object> {
  for await (const [key, value] of Object.entries(obj))
    if (filter(value) === false) delete (obj as any)[key];

  return obj;
}
