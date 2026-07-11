"use client";

import { Send, Utensils } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  EmptyState,
  Input,
  LoadingRows,
  Panel,
  Select,
  TextArea,
} from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  type FoodMenu,
  type FoodPhoto,
  type LoadState,
  ResidentHeader,
  Message,
  field,
  optionalField,
} from "./resident-shared";

export const ResidentFoodPageContent = memo(function ResidentFoodPageContent() {
  const [menus, setMenus] = useState<FoodMenu[]>([]);
  const [photos, setPhotos] = useState<FoodPhoto[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");
  const [photoAssetId, setPhotoAssetId] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ menus: FoodMenu[]; photos: FoodPhoto[] }>(
        "/api/v1/resident/food",
      );

      setMenus(data.menus);
      setPhotos(data.photos);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load food.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const handleFeedback = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/resident/food/feedback", {
        body: JSON.stringify({
          comment: optionalField(form, "comment"),
          date: field(form, "date"),
          isAnonymous: form.get("isAnonymous") === "on",
          mealType: field(form, "mealType"),
          menuId: optionalField(form, "menuId"),
          rating: Number(field(form, "rating")),
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      setMessage("Feedback submitted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit feedback.");
    }
  }, []);

  const handlePhotoFile = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const { uploadFile, optimizeImage } = await import("@/lib/client-upload");
      const assetId = await uploadFile(file, "PRIVATE");
      optimizeImage(assetId).catch(() => {});
      setPhotoAssetId(assetId);
      setMessage("Food photo uploaded to storage.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not upload photo.");
    } finally {
      setUploadingPhoto(false);
    }
  }, []);

  const handlePhoto = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    if (!photoAssetId) {
      setMessage("Please upload a photo first.");
      return;
    }

    try {
      await browserApi("/api/v1/resident/food/photos", {
        body: JSON.stringify({
          caption: optionalField(form, "caption"),
          date: field(form, "date"),
          mealType: field(form, "mealType"),
          photoAssetId,
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      setPhotoAssetId("");
      setMessage("Food photo uploaded.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not upload photo.");
    }
  }, [photoAssetId, load]);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <ResidentHeader
        description="View menu updates, food photos, and send feedback."
        icon={Utensils}
        title="Food"
      />
      <Message value={message} />
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel title="Menu">
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? <EmptyState label="Food could not be loaded." /> : null}
          {state === "ready" && menus.length === 0 ? (
            <EmptyState label="No menu posted." />
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            {menus.map((menu) => (
              <div className="rounded-lg border border-border p-4" key={menu.id}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-primary">{menu.mealType}</p>
                  <span className="text-xs text-muted-foreground">{menu.timing}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {menu.items.join(", ")}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {photos.map((photo) => (
              <div className="rounded-lg border border-border p-3" key={photo.id}>
                {photo.photoAssetId ? (
                  <img
                    alt={photo.caption ?? "Food photo"}
                    className="mb-2 h-32 w-full rounded-md object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    src={`/api/v1/files/${photo.photoAssetId}/url?variant=THUMBNAIL`}
                  />
                ) : null}
                <p className="font-semibold text-primary">{photo.mealType}</p>
                <p className="mt-2 text-sm text-muted-foreground">{photo.caption}</p>
              </div>
            ))}
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Send Feedback">
            <form className="grid gap-3" onSubmit={handleFeedback}>
              <Select label="Menu" name="menuId">
                <option value="">General feedback</option>
                {menus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.mealType} / {new Date(menu.date).toLocaleDateString()}
                  </option>
                ))}
              </Select>
              <Input label="Date" name="date" required type="date" />
              <Select label="Meal" name="mealType" required>
                {["BREAKFAST", "LUNCH", "SNACKS", "DINNER"].map((meal) => (
                  <option key={meal} value={meal}>
                    {meal}
                  </option>
                ))}
              </Select>
              <Input label="Rating" name="rating" required type="number" />
              <TextArea label="Comment" name="comment" />
              <label className="flex items-center gap-2 text-sm text-primary">
                <input name="isAnonymous" type="checkbox" />
                Anonymous
              </label>
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-role-resident text-sm font-semibold text-white">
                <Send className="size-4" />
                Submit
              </button>
            </form>
          </Panel>
          <Panel title="Upload Photo">
            <form className="grid gap-3" onSubmit={handlePhoto}>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-primary">Photo</label>
                <input
                  accept="image/jpeg,image/png,image/webp"
                  className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm file:mr-3 file:h-8 file:rounded-md file:border-0 file:bg-role-resident file:px-3 file:text-xs file:font-semibold file:text-white"
                  disabled={uploadingPhoto}
                  onChange={handlePhotoFile}
                  required
                  type="file"
                />
                {uploadingPhoto ? (
                  <p className="text-xs text-muted-foreground">Uploading...</p>
                ) : photoAssetId ? (
                  <p className="text-xs text-emerald-600">Photo uploaded.</p>
                ) : null}
              </div>
              <input name="photoAssetId" type="hidden" value={photoAssetId} />
              <Input label="Date" name="date" required type="date" />
              <Select label="Meal" name="mealType" required>
                {["BREAKFAST", "LUNCH", "SNACKS", "DINNER"].map((meal) => (
                  <option key={meal} value={meal}>
                    {meal}
                  </option>
                ))}
              </Select>
              <Input label="Caption" name="caption" />
              <button
                className="h-11 rounded-md border border-role-resident text-sm font-semibold text-role-resident disabled:opacity-50"
                disabled={uploadingPhoto || !photoAssetId}
                type="submit"
              >
                Upload Photo
              </button>
            </form>
          </Panel>
        </div>
      </div>
    </div>
  );
});
