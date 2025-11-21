import torch
import torch.nn as nn

class MyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 16, 3)
        self.fc = nn.Linear(16*222*222, 10) 

    def forward(self, x):
        x = self.conv1(x)
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return x

def load_model(path="predictor.pt"):
    model = MyModel()
    state_dict = torch.load(path, map_location="cpu")
    if "model_state_dict" in state_dict:  
        state_dict = state_dict["model_state_dict"]
    model.load_state_dict(state_dict)
    model.eval()
    return model
