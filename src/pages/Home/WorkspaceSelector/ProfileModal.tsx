import { useRef, useState, type ChangeEvent } from "react";
import { useCurrentUserStore } from "../../../modules/auth/current-user.state";
import { useUiStore } from "../../../modules/ui/ui.state";
import { accountRepository } from "../../../modules/account/account.repository";

function ProfileModal() {
  const { setShowProfileModal } = useUiStore();
  const { currentUser, setCurrentUser } = useCurrentUserStore();
  const [name, setName] = useState(currentUser!.name);
  const [thumbnail, setThumbnail] = useState<File | undefined>();
  const [thumbnailUrl, setThumbnailUrl] = useState(currentUser!.thumbnailUrl);
  // ここで「ファイル入力欄（<input type="file">）へのポインタ」を作成
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = async () => {
    try {
      const user = await accountRepository.updateProfile(name, thumbnail);
      setCurrentUser(user); // userを変更したら、currentUserも変更する必要がある
      setShowProfileModal(false);
    } catch (error) {
      console.error("プロフィールの更新に失敗しました", error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files[0] === null) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    /**
     * ファイルの読み込みが完了したときに実行される処理。FileReaderのonloadイベントが発火したときに呼ばれるコールバック。
     * ファイルを読み取り、thumbnailとthumbnailUrlを更新する
     */
    reader.onload = () => {
      setThumbnail(file);
      setThumbnailUrl(reader.result as string);
    };
    // 渡されたファイルからURLを取得するコード
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="profile-modal-overlay"
      onClick={() => setShowProfileModal(false)}
    >
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>Edit your profile</h2>
        </div>

        <div className="profile-modal-content">
          <div className="profile-form">
            <div className="profile-form-left">
              <div className="form-group">
                <label htmlFor="fullName">Full name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="profile-input"
                />
              </div>
            </div>
            {/* 普通に <input type="file"> を置くと、ブラウザ標準の「ファイルを選択」ボタンが表示されてしまいます。でも、それはデザインをカスタマイズできない。
            なので「input自体を隠し、自作したおしゃれなボタンをクリックで動かす」という工夫をしている。
            このコードは：非表示の <input type="file"> を useRef で参照して、見た目のボタンからそのinputを「間接的にクリック」させることで、ユーザーにファイル（画像など）を選ばせる仕組みを作っている。 */}
            <div className="profile-form-right">
              <div className="profile-photo-section">
                <label>Profile photo</label>
                <div className="profile-photo-container">
                  <div className="profile-photo-placeholder">
                    {thumbnailUrl != null ? (
                      <img
                        src={thumbnailUrl}
                        alt="プロフィール画像"
                        className="profile-photo-placeholder"
                      />
                    ) : (
                      <div className="profile-photo-circle" />
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {/* 下のボタンが押されたら上のボタンが間接的に押されるというコード */}
                <button
                  className="upload-photo-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Photo
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-modal-footer">
          <button
            className="cancel-button"
            onClick={() => setShowProfileModal(false)}
          >
            Cancel
          </button>
          <button className="save-button" onClick={updateProfile}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileModal;
